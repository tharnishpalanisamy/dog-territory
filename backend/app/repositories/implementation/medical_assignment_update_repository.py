from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import MedicalAssignmentUpdate


class MedicalAssignmentUpdateRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, update: MedicalAssignmentUpdate) -> MedicalAssignmentUpdate:
        self.db.add(update)
        await self.db.flush()
        await self.db.refresh(update)
        return update

    async def get_by_id(self, update_id: int) -> MedicalAssignmentUpdate | None:
        return await self.db.scalar(
            select(MedicalAssignmentUpdate).where(
                MedicalAssignmentUpdate.id == update_id
            )
        )

    async def get_by_assignment_id(
        self, assignment_id: int
    ) -> list[MedicalAssignmentUpdate]:
        result = await self.db.scalars(
            select(MedicalAssignmentUpdate)
            .where(MedicalAssignmentUpdate.medical_assignment_id == assignment_id)
            .order_by(
                MedicalAssignmentUpdate.created_at.desc(),
                MedicalAssignmentUpdate.id.desc(),
            )
        )
        return result.all()

    async def update(
        self, update: MedicalAssignmentUpdate, fields: dict
    ) -> MedicalAssignmentUpdate:
        for field, value in fields.items():
            setattr(update, field, value)
        await self.db.flush()
        await self.db.refresh(update)
        return update

    async def delete(self, update: MedicalAssignmentUpdate) -> None:
        await self.db.delete(update)
        await self.db.flush()
