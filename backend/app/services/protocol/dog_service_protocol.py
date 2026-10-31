from collections.abc import Sequence
from typing import Protocol

from app.models import Dog, User
from app.schemas import DogCreate


class DogServiceProtocol(Protocol):
    async def create_dog(self, dog_data: DogCreate, current_user: User) -> Dog: ...

    async def get_all_dogs(self) -> Sequence[Dog]: ...

    async def get_dog_by_id(self, id) -> Dog: ...

    async def update_dog_by_id(self, id, dog_data): ...
