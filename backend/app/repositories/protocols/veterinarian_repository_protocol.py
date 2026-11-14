from typing import Protocol

from app.core import VeterinarianApprovalStatus
from app.models import Veterinarian


class VeterinarianRepositoryProtocol(Protocol):
    async def create(self, veterinarian: Veterinarian) -> Veterinarian: ...

    async def get_by_id(self, veterinarian_id: int) -> Veterinarian | None: ...

    async def get_by_user_id(self, user_id: int) -> Veterinarian | None: ...

    async def license_number_exists(
        self, license_number: str, exclude_id: int | None = None
    ) -> bool: ...

    async def get_all(
        self,
        approval_status: VeterinarianApprovalStatus | None,
        clinic_id: int | None,
        limit: int,
        offset: int,
    ) -> list[Veterinarian]: ...

    async def update(self, veterinarian: Veterinarian, fields: dict) -> Veterinarian: ...
