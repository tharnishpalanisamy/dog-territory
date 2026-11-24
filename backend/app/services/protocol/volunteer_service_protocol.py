from collections.abc import Sequence
from typing import Protocol

from app.core import VolunteerAvailability
from app.models import Volunteer
from app.schemas.volunteer import (
    VolunteerApprovalUpdate,
    VolunteerCreate,
    VolunteerUpdate,
)


class VolunteerServiceProtocol(Protocol):
    async def create_profile(
        self, user_id: int, data: VolunteerCreate
    ) -> Volunteer: ...

    async def get_by_user_id(self, user_id: int) -> Volunteer: ...

    async def require_approved_volunteer(self, user_id: int) -> Volunteer: ...

    async def update_profile(
        self, user_id: int, data: VolunteerUpdate
    ) -> Volunteer: ...

    async def get_all(self, limit: int, offset: int) -> Sequence[Volunteer]: ...

    async def get_nearby(
        self,
        pincode: str | None,
        limit: int,
        offset: int,
        availability: VolunteerAvailability | None = None,
        search: str | None = None,
    ) -> Sequence[Volunteer]: ...

    async def get_by_id(self, volunteer_id: int) -> Volunteer: ...

    async def update_approval(
        self, volunteer_id: int, data: VolunteerApprovalUpdate
    ) -> Volunteer: ...

    async def delete(self, volunteer_id: int) -> None: ...
