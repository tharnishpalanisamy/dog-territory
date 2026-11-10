from typing import Protocol

from app.models import User, WorkAssignment
from app.schemas import WorkAssignmentCreate


class WorkAssignmentServiceProtocol(Protocol):
    async def create_work_assignment(
        self, user: User, assignment_data: WorkAssignmentCreate
    ) -> WorkAssignment: ...

    async def get_all_assignments(
        self, filters, limit: int, offset: int
    ) -> list[WorkAssignment]: ...

    async def get_available_work_assignments(
        self, filters, limit, offset
    ) -> list[WorkAssignment]: ...

    async def get_assigned_assignments(self , user: User) -> list[WorkAssignment]: ...


    async def update_assigned_to(self, assignment_id: int, data) -> WorkAssignment: ...