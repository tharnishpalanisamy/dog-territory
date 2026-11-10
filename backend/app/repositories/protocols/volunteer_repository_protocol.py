from collections.abc import Sequence
from typing import Protocol

from app.models import Volunteer


class VolunteerRepositoryProtocol(Protocol):
    async def create(self, volunteer: Volunteer) -> Volunteer: ...

    async def get_by_id(self, volunteer_id: int) -> Volunteer | None: ...

    async def get_by_user_id(self, user_id: int) -> Volunteer | None: ...

    async def get_all(self, limit: int, offset: int) -> Sequence[Volunteer]: ...


    async def update(
        self,
        volunteer: Volunteer,
        data: dict,
    ) -> Volunteer:... 
    
    async def delete(self, volunteer: Volunteer) -> None: ...
