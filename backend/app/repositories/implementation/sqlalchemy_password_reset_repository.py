from datetime import UTC, datetime

from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import PasswordReset


class PasswordResetRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, password_reset: PasswordReset) -> None:
        self.db.add(password_reset)
        await self.db.flush()
        await self.db.refresh(password_reset)

    async def invalidate_previous(self, user_id: int) -> None:
        query = (
            update(PasswordReset)
            .where(
                PasswordReset.user_id == user_id, PasswordReset.consumed_at.is_(None)
            )
            .values(consumed_at=datetime.now(UTC))
        )

        await self.db.execute(query)

    async def get_latest_by_user(self, user_id: int) -> PasswordReset:
        query = (
            select(PasswordReset)
            .where(PasswordReset.user_id == user_id)
            .order_by(PasswordReset.created_at.desc())
        )

        result = await self.db.execute(query)

        return result.scalar_one()

    async def increment_attempts(self, reset_record_id) -> None:
        query = (
            update(PasswordReset)
            .where(PasswordReset.id == reset_record_id)
            .values(attempts=PasswordReset.attempts + 1)
        )

        await self.db.execute(query)

    async def get_by_reset_token_hash(self, reset_token_hash) -> PasswordReset | None:
        query = select(PasswordReset).where(
            PasswordReset.reset_token_hash == reset_token_hash
        )

        return await self.db.scalar(query)

    async def mark_consumed(self, reset_record_id) -> None:
        query = (
            update(PasswordReset)
            .where(PasswordReset.id == reset_record_id)
            .values(consumed_at=datetime.now(UTC))
        )

        await self.db.execute(query)
