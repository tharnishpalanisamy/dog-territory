from sqlalchemy.ext.asyncio import AsyncSession

from app.models import User
from app.repositories.protocols import UserRepositoryProtocol
from app.schemas import UserLocationUpdate


class UserService:
    def __init__(self, db: AsyncSession, repository: UserRepositoryProtocol):
        self.db = db
        self.repository = repository

    async def update_user_location(self, user: User, location_data: UserLocationUpdate):
        fields = {**location_data.model_dump()}

        try:
            result = await self.repository.update(user, fields)
            await self.db.commit()
            return result
        except Exception:
            await self.db.rollback()
            raise
