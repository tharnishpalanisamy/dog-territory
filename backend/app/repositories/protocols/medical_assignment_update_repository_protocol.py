from typing import Protocol

from app.models import MedicalAssignmentUpdate


class MedicalAssignmentUpdateRepositoryProtocol(Protocol):
    async def create(
        self, update: MedicalAssignmentUpdate
    ) -> MedicalAssignmentUpdate: ...

    async def get_by_id(self, update_id: int) -> MedicalAssignmentUpdate | None: ...

    async def get_by_assignment_id(
        self, assignment_id: int
    ) -> list[MedicalAssignmentUpdate]: ...

    async def update(
        self, update: MedicalAssignmentUpdate, fields: dict
    ) -> MedicalAssignmentUpdate: ...

    async def delete(self, update: MedicalAssignmentUpdate) -> None: ...
