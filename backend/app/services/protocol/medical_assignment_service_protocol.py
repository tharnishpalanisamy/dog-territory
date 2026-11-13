from typing import Protocol

from app.models import MedicalAssignment
from app.schemas import MedicalAssignmentCreate, MedicalAssignmentFilterParams


class MedicalAssignmentServiceProtocol(Protocol):
    async def create(
        self, data: MedicalAssignmentCreate, user
    ) -> MedicalAssignment: ...

    async def get_all(
        self, filters: MedicalAssignmentFilterParams, limit: int, offset: int
    ) -> list[MedicalAssignment]: ...

    async def get_by_id(self, assignment_id: int) -> MedicalAssignment: ...

    async def get_authorized_by_id(
        self, assignment_id: int, user
    ) -> MedicalAssignment: ...

    async def get_by_work_assignment_id(
        self, work_assignment_id: int
    ) -> list[MedicalAssignment]: ...

    async def claim(self, assignment_id: int, user) -> MedicalAssignment: ...

    async def start(self, assignment_id: int, user) -> MedicalAssignment: ...

    async def ready_for_pickup(self, assignment_id: int, user) -> MedicalAssignment: ...

    async def release(self, assignment_id: int, user) -> MedicalAssignment: ...

    async def cancel(self, assignment_id: int, user) -> MedicalAssignment: ...

    async def reassign(
        self, assignment_id: int, veterinarian_user_id: int, user
    ) -> MedicalAssignment: ...
