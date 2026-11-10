from datetime import UTC, datetime

from sqlalchemy import or_, select
from sqlalchemy.orm import selectinload

from app.core import AssignmentStatus
from app.models import Report, WorkAssignment


class WorkAssignmentRepository:
    def __init__(self, db):
        self.db = db

    async def create(self, assignment) -> WorkAssignment:
        self.db.add(assignment)
        await self.db.flush()
        await self.db.refresh(assignment)

        return assignment

    async def get_all(self, filters, limit, offset) -> list[WorkAssignment]:
        query = select(WorkAssignment)

        conditions = []

        if filters.search is not None:
            conditions.append(
                or_(
                    WorkAssignment.title.ilike(f"%{filters.search}%"),
                    WorkAssignment.description.ilike(f"%{filters.search}%"),
                )
            )

        if filters.report_id is not None:
            conditions.append(WorkAssignment.report_id == filters.report_id)
        if filters.task_type is not None:
            conditions.append(WorkAssignment.task_type == filters.task_type)
        if filters.priority is not None:
            conditions.append(WorkAssignment.priority == filters.priority)
        if filters.status is not None:
            conditions.append(WorkAssignment.status == filters.status)

        if filters.assigned_to is not None:
            conditions.append(WorkAssignment.assigned_to == filters.assigned_to)
        if filters.assigned_by is not None:
            conditions.append(WorkAssignment.assigned_by == filters.assigned_by)

        if filters.created_from is not None:
            conditions.append(WorkAssignment.created_at >= filters.created_from)
        if filters.created_to is not None:
            conditions.append(WorkAssignment.created_at <= filters.created_to)

        if filters.state is not None:
            conditions.append(WorkAssignment.report.state == filters.state)

        if filters.pincode is not None:
            conditions.append(WorkAssignment.report.pincode == filters.pincode)
        if filters.state is not None:
            conditions.append(WorkAssignment.report.state == filters.state)

        if filters.district is not None:
            conditions.append(WorkAssignment.report.district == filters.district)

        if filters.area_name is not None:
            conditions.append(WorkAssignment.report.area_name == filters.area_name)

        query = (
            query.where(*conditions)
            .order_by(WorkAssignment.created_at.desc(), WorkAssignment.id.desc())
            .limit(limit)
            .offset(offset)
        )

        result = await self.db.scalars(query)

        return result.all()

    async def get_available(self, filters, limit, offset) -> list[WorkAssignment]:
        query = select(WorkAssignment)
        conditions = []

        conditions.append(WorkAssignment.status == AssignmentStatus.OPEN)
        conditions.append(WorkAssignment.assigned_to.is_(None))

        if filters.state is not None:
            conditions.append(WorkAssignment.report.state == filters.state)
        if filters.district is not None:
            conditions.append(WorkAssignment.report.district == filters.district)

        if filters.area_name is not None:
            conditions.append(WorkAssignment.report.area_name == filters.area_name)

        if filters.priority is not None:
            conditions.append(WorkAssignment.priority == filters.priority)

        if filters.task_type is not None:
            conditions.append(WorkAssignment.task_type == filters.task_type)

        if filters.search is not None:
            conditions.append(
                or_(
                    WorkAssignment.title.ilike(f"%{filters.search}%"),
                    WorkAssignment.description.ilike(f"%{filters.search}%"),
                )
            )

        query = (
            query.where(*conditions)
            .order_by(WorkAssignment.created_at)
            .limit(limit)
            .offset(offset)
        )

        result = await self.db.scalars(query)

        return result.all()

    async def get_assignments_by_volunteer_id(self, id) -> list[WorkAssignment]:
        query = select(WorkAssignment).where(WorkAssignment.assigned_to == id)
        result = await self.db.scalars(query)
        return result.all()

    async def get_by_id(self, id) -> WorkAssignment | None:
        query = (
            select(WorkAssignment)
            .options(selectinload(WorkAssignment.report).selectinload(Report.dog))
            .where(WorkAssignment.id == id)
        )
        result = await self.db.scalar(query)
        return result

    async def update_assigned_to(
        self, assignment: WorkAssignment, assigned_to: int, assigned_by: int
    ) -> WorkAssignment:

        assignment.assigned_to = assigned_to
        assignment.assigned_by = assigned_by
        await self.db.flush()
        await self.db.refresh(assignment)

        return assignment

    async def claim_assignment(
        self, assignment: WorkAssignment, assigned_to
    ) -> WorkAssignment:
        assignment.assigned_to = assigned_to
        assignment.accepted_at = datetime.now(UTC)
        assignment.status = AssignmentStatus.ACCEPTED
        await self.db.flush()
        await self.db.refresh(assignment)
        return assignment

    async def update_status(self, assignment, status) -> WorkAssignment:
        assignment.status = status
        await self.db.flush()
        await self.db.refresh(assignment)
        return assignment
