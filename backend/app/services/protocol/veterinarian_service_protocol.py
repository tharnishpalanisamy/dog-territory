from typing import Protocol

from fastapi import UploadFile

from app.core import VeterinarianApprovalStatus
from app.models import User, Veterinarian
from app.schemas import (
    VeterinarianApprovalUpdate,
    VeterinarianCreate,
    VeterinarianUpdate,
)


class VeterinarianServiceProtocol(Protocol):
    async def apply(
        self, user: User, data: VeterinarianCreate, document: UploadFile | None
    ) -> Veterinarian: ...

    async def get_mine(self, user: User) -> Veterinarian: ...

    async def update_mine(
        self, user: User, data: VeterinarianUpdate, document: UploadFile | None
    ) -> Veterinarian: ...

    async def get_all(
        self,
        approval_status: VeterinarianApprovalStatus | None,
        clinic_id: int | None,
        page: int,
        limit: int,
    ) -> list[Veterinarian]: ...

    async def get_pending(self, page: int, limit: int) -> list[Veterinarian]: ...

    async def get_by_id(self, veterinarian_id: int) -> Veterinarian: ...

    async def update_approval(
        self, veterinarian_id: int, admin: User, data: VeterinarianApprovalUpdate
    ) -> Veterinarian: ...
