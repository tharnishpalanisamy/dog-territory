from typing import Protocol

from app.models import WorkAssignment


class WorkAssignmentRepositoryProtocol(Protocol):
    async def create(self, assignment) -> WorkAssignment: ...

    async def get_all(self, filters, limit, offset) -> list[WorkAssignment]: ...
