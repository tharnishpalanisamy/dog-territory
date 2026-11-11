from typing import Protocol

from app.models import AssignmentUpdate


class AssignmentUpdateRepositoryProtocol(Protocol):
    async def create(
        self,
        assignment_update: AssignmentUpdate,
    ) -> AssignmentUpdate: ...
