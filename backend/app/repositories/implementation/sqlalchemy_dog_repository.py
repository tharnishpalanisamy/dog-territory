from collections.abc import Sequence

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Dog


class DogRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, dog: Dog) -> Dog :
        self.db.add(dog)
        await self.db.flush()
        await self.db.refresh(dog)

        return dog

    async def get_all(self) -> Sequence[Dog]:
        query = select(Dog)

        result = await self.db.scalars(query)

        return result.all()

    async def get_by_id(self, id) -> Dog | None :
        query = select(Dog).where(
            Dog.id == id 
        )

        return await self.db.scalar(query)

    async def update_by_id(self, id, dog):
        pass

    async def get_max_count(self, pin_code: str) -> int | None:
        query = select(func.max(Dog.dog_number)).where(Dog.pincode == pin_code)

        result = await self.db.scalar(query)
        return result
