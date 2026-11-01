from collections.abc import Sequence

from sqlalchemy.ext.asyncio import AsyncSession

from app.exceptions import DogNotFoundException
from app.models import Dog, User
from app.repositories.protocols import DogRepositoryProtocol
from app.schemas import DogCreate, DogFilterParams, DogUpdate


class DogService:
    def __init__(self, db: AsyncSession, repository: DogRepositoryProtocol) -> None:
        self.db = db
        self.repository = repository

    async def create_dog(self, dog_data: DogCreate, current_user: User) -> Dog:
        # 1. Get the highest assigned dog number for this pin code
        max_number = await self.repository.get_max_count(dog_data.pin_code)

        # 2. Generate the next dog number
        dog_number = (max_number or 0) + 1

        # 3. Generate the dog code
        dog_code = f"{dog_data.pin_code}-{dog_number}"

        # 4. Create the SQLAlchemy model instance
        dog = Dog(
            dog_code=dog_code,
            dog_number=dog_number,
            state=dog_data.state,
            district=dog_data.district,
            area_name=dog_data.area_name,
            pincode=dog_data.pin_code,
            estimated_age=dog_data.estimated_age,
            color=dog_data.color,
            description=dog_data.description,
            is_sterilized=dog_data.is_sterilized,
            latitude=dog_data.latitude,
            longitude=dog_data.longitude,
            vaccination_status=dog_data.vaccination_status,
            vaccination_date=dog_data.vaccination_date,
            next_booster_due_date=dog_data.booster_dose_date,
            created_by=current_user.id,
        )

        # 5. Persist and commit
        result = await self.repository.create(dog)
        await self.db.commit()

        return result

    async def get_all_dogs(
        self, filters: DogFilterParams, limit: int, offset: int
    ) -> Sequence[Dog]:
        result = await self.repository.get_all(filters, limit, offset)
        return result

    async def get_dog_by_id(self, id) -> Dog:

        dog = await self.repository.get_by_id(id)

        if dog is None:
            raise DogNotFoundException(f"Dog with ID {id} not found")
        return dog

    async def get_dog_by_dog_code(self, dog_code: str):
        dog = await self.repository.get_by_dog_code(dog_code)

        if dog is None:
            raise DogNotFoundException(f"Dog with code {dog_code} not found")
        return dog

    async def update_dog_by_id(self, dog_id: int, dog_data: DogUpdate) -> Dog:
        dog = await self.repository.get_by_id(dog_id)
        if dog is None:
            raise DogNotFoundException(f"Dog with ID {dog_id} not found")

        fields = dog_data.model_dump(exclude_unset=True)
        updated_dog = await self.repository.update_by_id(dog, fields)
        await self.db.commit()
        return updated_dog

    async def update_dog_by_dog_code(self, dog_code: str, dog_data: DogUpdate) -> Dog:
        dog = await self.repository.get_by_dog_code(dog_code)
        if dog is None:
            raise DogNotFoundException(f"Dog with code {dog_code} not found")

        fields = dog_data.model_dump(exclude_unset=True)
        updated_dog = await self.repository.update_by_dog_code(dog, fields)
        await self.db.commit()
        return updated_dog

    async def delete_dog_by_dog_code(self, dog_code: str) -> None:
        return await self.repository.delete_dog_code(dog_code)

    async def delete_dog_by_id(self, dog_id: int) -> None:
        return await self.repository.delete_by_id(dog_id)
