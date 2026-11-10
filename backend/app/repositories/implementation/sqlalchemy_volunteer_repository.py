from collections.abc import Sequence

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Volunteer


class VolunteerRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, volunteer: Volunteer) -> Volunteer:
        self.db.add(volunteer)

        await self.db.flush()
        await self.db.refresh(volunteer)

        return volunteer

    async def get_by_id(self, volunteer_id: int) -> Volunteer | None:
        return await self.db.get(Volunteer, volunteer_id)

    async def get_by_user_id(self, user_id: int) -> Volunteer | None:
        query = select(Volunteer).where(Volunteer.user_id == user_id)

        result = await self.db.scalars(query)

        return result.first()

    async def get_all(self, limit: int, offset: int) -> Sequence[Volunteer]:

        query = (
            select(Volunteer).order_by(Volunteer.id.desc()).offset(offset).limit(limit)
        )

        result = await self.db.scalars(query)

        return result.all()

    async def update(
        self,
        volunteer: Volunteer,
        data: dict,
    ) -> Volunteer:

        for field, value in data.items():
            setattr(volunteer, field, value)

        await self.db.flush()
        await self.db.refresh(volunteer)

        return volunteer

    async def delete(self, volunteer: Volunteer) -> None:
        await self.db.delete(volunteer)
        await self.db.flush()
