from typing import Protocol

from app.models import Clinic
from app.schemas import ClinicFilterParams


class ClinicRepositoryProtocol(Protocol):
    async def create(self, clinic: Clinic) -> Clinic: ...

    async def get_by_id(self, clinic_id: int) -> Clinic | None: ...

    async def get_all(
        self, filters: ClinicFilterParams, limit: int, offset: int
    ) -> list[Clinic]: ...

    async def update(self, clinic: Clinic, fields: dict) -> Clinic: ...

    async def delete(self, clinic: Clinic) -> None: ...
