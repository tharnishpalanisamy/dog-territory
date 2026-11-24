from typing import Protocol

from app.models import User
from app.schemas import (
    DogCreate,
    DogDetailResponse,
    DogFilterParams,
    DogSummaryResponse,
    DogUpdate,
)


class DogServiceProtocol(Protocol):
    async def create_dog(
        self, dog_data: DogCreate, current_user: User
    ) -> DogDetailResponse: ...

    async def get_all_dogs(
        self, filters: DogFilterParams, limit: int, offset: int
    ) -> list[DogSummaryResponse]: ...

    async def get_dog_by_id(self, id: int) -> DogDetailResponse: ...

    async def get_dog_by_dog_code(self, dog_code: str) -> DogDetailResponse: ...

    async def delete_dog_by_dog_code(self, dog_code: str) -> None: ...

    async def delete_dog_by_id(self, dog_id: int) -> None: ...

    async def update_dog_by_id(
        self, dog_id: int, dog_data: DogUpdate
    ) -> DogDetailResponse: ...

    async def update_dog_by_dog_code(
        self, dog_code: str, dog_data: DogUpdate
    ) -> DogDetailResponse: ...
