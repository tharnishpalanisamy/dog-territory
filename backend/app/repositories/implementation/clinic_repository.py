from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Clinic
from app.schemas import ClinicFilterParams


class ClinicRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, clinic: Clinic) -> Clinic:
        self.db.add(clinic)
        await self.db.flush()
        await self.db.refresh(clinic)
        return clinic

    async def get_by_id(self, clinic_id: int) -> Clinic | None:
        return await self.db.get(Clinic, clinic_id)

    async def get_all(
        self, filters: ClinicFilterParams, limit: int, offset: int
    ) -> list[Clinic]:
        query = select(Clinic)
        conditions = []
        if filters.city is not None:
            conditions.append(Clinic.city.ilike(filters.city))
        if filters.state is not None:
            conditions.append(Clinic.state.ilike(filters.state))
        if filters.pincode is not None:
            conditions.append(Clinic.pincode == filters.pincode)
        if filters.is_active is not None:
            conditions.append(Clinic.is_active == filters.is_active)
        if filters.search is not None:
            pattern = f"%{filters.search}%"
            conditions.append(
                or_(Clinic.name.ilike(pattern), Clinic.address.ilike(pattern))
            )
        result = await self.db.scalars(
            query.where(*conditions)
            .order_by(Clinic.name, Clinic.id)
            .limit(limit)
            .offset(offset)
        )
        return result.all()

    async def update(self, clinic: Clinic, fields: dict) -> Clinic:
        for field, value in fields.items():
            setattr(clinic, field, value)
        await self.db.flush()
        await self.db.refresh(clinic)
        return clinic

    async def delete(self, clinic: Clinic) -> None:
        await self.db.delete(clinic)
        await self.db.flush()
