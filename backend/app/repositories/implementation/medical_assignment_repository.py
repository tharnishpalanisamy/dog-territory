from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models import MedicalAssignment, Veterinarian, Volunteer


class MedicalAssignmentRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, assignment: MedicalAssignment) -> MedicalAssignment:
        self.db.add(assignment)
        await self.db.flush()
        await self.db.refresh(assignment)
        return assignment

    async def get_all(
        self, filters, limit: int, offset: int
    ) -> list[MedicalAssignment]:
        query = select(MedicalAssignment).options(
            selectinload(MedicalAssignment.dog),
            selectinload(MedicalAssignment.clinic),
            selectinload(MedicalAssignment.updates),
        )
        conditions = []
        for field in (
            "dog_id",
            "work_assignment_id",
            "clinic_id",
            "created_by",
            "volunteer_id",
            "veterinarian_id",
            "mode",
            "status",
        ):
            value = getattr(filters, field, None)
            if value is not None:
                conditions.append(getattr(MedicalAssignment, field) == value)
        search = getattr(filters, "search", None)
        if search is not None:
            pattern = f"%{search}%"
            conditions.append(
                or_(
                    MedicalAssignment.title.ilike(pattern),
                    MedicalAssignment.description.ilike(pattern),
                )
            )

        result = await self.db.scalars(
            query.where(*conditions)
            .order_by(MedicalAssignment.created_at.desc(), MedicalAssignment.id.desc())
            .limit(limit)
            .offset(offset)
        )
        return result.unique().all()

    async def get_by_id(self, assignment_id: int) -> MedicalAssignment | None:
        result = await self.db.scalar(
            select(MedicalAssignment)
            .options(
                selectinload(MedicalAssignment.dog),
                selectinload(MedicalAssignment.clinic),
                selectinload(MedicalAssignment.updates),
            )
            .where(MedicalAssignment.id == assignment_id)
        )
        return result

    async def get_by_work_assignment_id(
        self, work_assignment_id: int
    ) -> list[MedicalAssignment]:
        result = await self.db.scalars(
            select(MedicalAssignment)
            .where(MedicalAssignment.work_assignment_id == work_assignment_id)
            .order_by(MedicalAssignment.created_at.desc(), MedicalAssignment.id.desc())
        )
        return result.all()

    async def get_veterinarian_for_user(self, user_id: int) -> Veterinarian | None:
        return await self.db.scalar(
            select(Veterinarian).where(Veterinarian.user_id == user_id)
        )

    async def get_volunteer_by_user_id(self, user_id: int) -> Volunteer | None:
        return await self.db.scalar(
            select(Volunteer).where(Volunteer.user_id == user_id)
        )

    async def get_veterinarian_by_id(self, veterinarian_id: int) -> Veterinarian | None:
        return await self.db.get(Veterinarian, veterinarian_id)

    async def update(
        self, assignment: MedicalAssignment, fields: dict
    ) -> MedicalAssignment:
        for field, value in fields.items():
            setattr(assignment, field, value)
        await self.db.flush()
        await self.db.refresh(assignment)
        return assignment

    async def delete(self, assignment: MedicalAssignment) -> None:
        await self.db.delete(assignment)
        await self.db.flush()
