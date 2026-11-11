from typing import Protocol

from app.models import User, WorkAssignment
from app.schemas import AssignAssignment, WorkAssignmentCreate


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


    async def update_assigned_to(
        self, assignment_id: int, data: AssignAssignment, user: User
    ) -> WorkAssignment: ...

    async def get_assignment_by_id(self , assignment_id) -> WorkAssignment :
        ... 

    async def claim_assignment(self , assignment_id:int , user:User ) -> WorkAssignment :
        ... 

    async def update_status(self , assignment_id , data , user ) -> WorkAssignment : ... 

    async def create_update(self , assignment_id, data, user) : ...