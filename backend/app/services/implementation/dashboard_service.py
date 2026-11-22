from sqlalchemy.ext.asyncio import AsyncSession

from app.models import User
from app.repositories.protocols import DashboardRepositoryProtocol


class DashboardService:
    def __init__(
        self,
        db: AsyncSession,
        repository: DashboardRepositoryProtocol,
    ):
        self.db = db
        self.repository = repository

    async def get_user_statistics(self, user: User) -> dict[str, int]:
        return await self.repository.get_user_statistics(user)

    async def get_volunteer_statistics(self, user: User) -> dict: ...

    async def get_veterinarian_statistics(self, user: User) -> dict: ...

    async def get_admin_statistics(self, user: User) -> dict: ...
