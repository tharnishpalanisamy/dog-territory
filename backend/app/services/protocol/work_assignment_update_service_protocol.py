from typing import Protocol

from app.models import AssignmentUpdate, User
from app.schemas import (
    AssignmentUpdateCreate,
    AssignmentUpdateFilterParams,
    AssignmentUpdatePatch,
)


class WorkAssignmentUpdateServiceProtocol(Protocol):
    async def get_all_updates(
        self, filters: AssignmentUpdateFilterParams, limit: int, offset: int
    ) -> list[AssignmentUpdate]: ...

    async def get_update_by_id(self, update_id: int) -> AssignmentUpdate: ...

    async def get_updates_by_assignment_id(
        self, assignment_id: int
    ) -> list[AssignmentUpdate]: ...

    async def create_update(
        self, data: AssignmentUpdateCreate, user: User
    ) -> AssignmentUpdate: ...

    async def update_update(
        self, update_id: int, data: AssignmentUpdatePatch, user: User
    ) -> AssignmentUpdate: ...

    async def delete_update(self, update_id: int, user: User) -> None: ...

    async def create_clinic_admission(
        assignment_id , data , user
    ) : ... 