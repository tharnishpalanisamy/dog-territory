from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core import VeterinarianApprovalStatus
from app.models import Veterinarian


class VeterinarianRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, veterinarian: Veterinarian) -> Veterinarian:
        self.db.add(veterinarian)
        await self.db.flush()
        await self.db.refresh(veterinarian)
        return veterinarian

    async def get_by_id(self, veterinarian_id: int) -> Veterinarian | None:
        return await self.db.get(Veterinarian, veterinarian_id)

    async def get_by_user_id(self, user_id: int) -> Veterinarian | None:
        result = await self.db.scalars(
            select(Veterinarian).where(Veterinarian.user_id == user_id)
        )
        return result.first()

    async def license_number_exists(
        self, license_number: str, exclude_id: int | None = None
    ) -> bool:
        query = select(Veterinarian.id).where(
            Veterinarian.license_number == license_number
        )
        if exclude_id is not None:
            query = query.where(Veterinarian.id != exclude_id)
        return await self.db.scalar(query) is not None

    async def get_all(
        self,
        approval_status: VeterinarianApprovalStatus | None,
        clinic_id: int | None,
        limit: int,
        offset: int,
    ) -> list[Veterinarian]:
        query = select(Veterinarian)
        if approval_status is not None:
            query = query.where(Veterinarian.approval_status == approval_status)
        if clinic_id is not None:
            query = query.where(Veterinarian.clinic_id == clinic_id)
        result = await self.db.scalars(
            query.order_by(Veterinarian.created_at.desc(), Veterinarian.id.desc())
            .limit(limit)
            .offset(offset)
        )
        return list(result.all())

    async def update(self, veterinarian: Veterinarian, fields: dict) -> Veterinarian:
        for field, value in fields.items():
            setattr(veterinarian, field, value)
        await self.db.flush()
        await self.db.refresh(veterinarian)
        return veterinarian
