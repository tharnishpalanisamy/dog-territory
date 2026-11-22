from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core import ReportStatus
from app.models import Dog, Report, User


class DashboardRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_user_statistics(self, user: User):
        query = select(
            select(func.count(Dog.id))
            .where(Dog.pincode == "641025")
            .scalar_subquery()
            .label("dogs_nearby"),
            select(func.count(Report.id))
            .where(Report.reporter_id == user.id)
            .scalar_subquery()
            .label("my_reports"),
            select(func.count(Report.id))
            .where(
                Report.reporter_id == user.id,
                Report.status == ReportStatus.IN_PROGRESS,
            )
            .scalar_subquery()
            .label("under_review"),
            select(func.count(Report.id))
            .where(
                Report.reporter_id == user.id,
                Report.status == ReportStatus.RESOLVED,
            )
            .scalar_subquery()
            .label("resolved"),
        )

        result = await self.db.execute(query)
        return dict(result.mappings().one())

    async def get_volunteer_statistics(self, user: User): ...

    async def get_veterinarian_statistics(self, user: User): ...

    async def get_admin_statistics(self, user: User): ...
