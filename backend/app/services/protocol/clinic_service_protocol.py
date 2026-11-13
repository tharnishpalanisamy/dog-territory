from typing import Protocol

from app.models import Clinic
from app.schemas import ClinicCreate, ClinicFilterParams, ClinicUpdate


class ClinicServiceProtocol(Protocol):
    async def create(self, data: ClinicCreate) -> Clinic: ...

    async def get_all(
        self, filters: ClinicFilterParams, limit: int, offset: int
    ) -> list[Clinic]: ...

    async def get_by_id(self, clinic_id: int) -> Clinic: ...

    async def update(self, clinic_id: int, data: ClinicUpdate) -> Clinic: ...

    async def delete(self, clinic_id: int) -> None: ...
