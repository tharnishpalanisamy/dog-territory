from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models import AssignmentUpdate, Report, WorkAssignment


class WorkAssignmentUpdateRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, update: AssignmentUpdate) -> AssignmentUpdate:
        self.db.add(update)
        await self.db.flush()
        await self.db.refresh(update)
        return update

    async def get_all(self, filters, limit: int, offset: int) -> list[AssignmentUpdate]:
        query = (
            select(AssignmentUpdate)
            .join(AssignmentUpdate.assignment)
            .join(WorkAssignment.report)
            .options(selectinload(AssignmentUpdate.assignment))
        )
        conditions = []
        if filters.assignment_id is not None:
            conditions.append(AssignmentUpdate.assignment_id == filters.assignment_id)
        if filters.updated_by is not None:
            conditions.append(AssignmentUpdate.updated_by == filters.updated_by)
        if filters.update_type is not None:
            conditions.append(AssignmentUpdate.update_type == filters.update_type)
        if filters.state is not None:
            conditions.append(Report.state == filters.state)
        if filters.district is not None:
            conditions.append(Report.district == filters.district)
        if filters.area_name is not None:
            conditions.append(Report.area_name == filters.area_name)
        if filters.pincode is not None:
            conditions.append(Report.pincode == filters.pincode)
        if filters.created_from is not None:
            conditions.append(AssignmentUpdate.created_at >= filters.created_from)
        if filters.created_to is not None:
            conditions.append(AssignmentUpdate.created_at <= filters.created_to)
        if filters.search is not None:
            conditions.append(AssignmentUpdate.description.ilike(f"%{filters.search}%"))

        result = await self.db.scalars(
            query.where(*conditions)
            .order_by(AssignmentUpdate.created_at.desc(), AssignmentUpdate.id.desc())
            .limit(limit)
            .offset(offset)
        )
        return result.all()

    async def get_by_id(self, update_id: int) -> AssignmentUpdate | None:
        return await self.db.scalar(
            select(AssignmentUpdate).where(AssignmentUpdate.id == update_id)
        )

    async def get_by_assignment_id(self, assignment_id: int) -> list[AssignmentUpdate]:
        result = await self.db.scalars(
            select(AssignmentUpdate)
            .where(AssignmentUpdate.assignment_id == assignment_id)
            .order_by(AssignmentUpdate.created_at.desc(), AssignmentUpdate.id.desc())
        )
        return result.all()

    async def update(self, update: AssignmentUpdate, fields: dict) -> AssignmentUpdate:
        for field, value in fields.items():
            setattr(update, field, value)
        await self.db.flush()
        await self.db.refresh(update)
        return update

    async def delete(self, update: AssignmentUpdate) -> None:
        await self.db.delete(update)
        await self.db.flush()
