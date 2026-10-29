from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import RefreshToken


class RefreshTokenRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, token: RefreshToken) -> RefreshToken:
        self.db.add(token)
        await self.db.flush()
        await self.db.refresh(token)
        return token

    async def get_token_by_hash(self, hash: str) -> RefreshToken:
        query = select(RefreshToken).where(RefreshToken.token_hash == hash)

        token = await self.db.scalar(query)

        return token

    async def get_token_by_hash_for_update(self, hash: str) -> RefreshToken:
        query = (
            select(RefreshToken)
            .where(RefreshToken.token_hash == hash)
            .with_for_update()
            .execution_options(populate_existing=True)
        )

        token = await self.db.scalar(query)

        return token

    async def revoke(self, token: RefreshToken, revoked_at) -> RefreshToken:
        token.revoked_at = revoked_at
        await self.db.flush()
        await self.db.refresh(token)

        return token

    async def revoke_all(self, user_id, revoked_at) -> None:
        query = update(
            RefreshToken.user_id == user_id, RefreshToken.revoked_at.is_(None)
        ).values(revoked_at=revoked_at)

        await self.db.execute(query)
        await self.db.flush()
