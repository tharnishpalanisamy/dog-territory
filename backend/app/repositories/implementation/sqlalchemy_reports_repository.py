from sqlalchemy import select

from app.models import Report, User
from app.schemas import ReportFilterParams


class ReportsRepository:
    def __init__(self, db):
        self.db = db

    async def create(self, report: Report) -> Report:
        self.db.add(report)
        await self.db.flush()
        await self.db.refresh(report)

        return report

    async def get_all(
        self, filters: ReportFilterParams, limit: int, offset: int
    ) -> list[Report]:
        query = select(Report)

        conditions = []

        if filters.report_type is not None:
            conditions.append(Report.report_type == filters.report_type)

        if filters.pincode is not None:
            conditions.append(Report.pincode == filters.pincode)

        query = (
            query.where(*conditions)
            .order_by(Report.created_at.desc())
            .limit(limit)
            .offset(offset)
        )

        result = await self.db.scalars(query)

        return result.all()

    async def get_by_id(self, id: int) -> Report | None:
        query = select(Report).where(Report.id == id)

        return await self.db.scalar(query)

    async def get_by_reporter_id(self, reporter_id) -> list[Report]:
        query = select(Report).where(Report.reporter_id == reporter_id)

        result = await self.db.scalars(query)

        return result.all()

    async def get_assigned_reports(self, user: User) -> list[Report]:
        return await self.get_by_reporter_id(user.id)

    async def update_status_by_id(self, report, status):
        report.status = status
        await self.db.flush()
        await self.db.refresh(report)
        return report
