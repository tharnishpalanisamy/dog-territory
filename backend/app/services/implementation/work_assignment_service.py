from app.exceptions import ReportNotFoundException, VolunteerNotFoundException
from app.models import User, WorkAssignment
from app.repositories.protocols import (
    ReportsRepositoryProtocol,
    VolunteerRepositoryProtocol,
    WorkAssignmentRepositoryProtocol,
)
from app.schemas import WorkAssignmentCreate


class WorkAssignmentService:
    def __init__(
        self,
        db,
        repository: WorkAssignmentRepositoryProtocol,
        report_repository: ReportsRepositoryProtocol,
        volunteer_repository: VolunteerRepositoryProtocol,
    ):
        self.db = db
        self.repository = repository
        self.report_repository = report_repository
        self.volunteer_repository = volunteer_repository

    async def create_work_assignment(
        self, user: User, assignment_data: WorkAssignmentCreate
    ) -> WorkAssignment:

        volunteer = await self.volunteer_repository.get_by_id(
            assignment_data.assigned_to
        )

        if volunteer is None:
            raise VolunteerNotFoundException(
                f"Volunteer with id {assignment_data.assigned_to} is not found"
            ) 
        

        report = await self.report_repository.get_by_id(assignment_data.report_id)

        if report is None:
            raise ReportNotFoundException(
                f"Report with id {assignment_data.report_id} not found"
            )
        assignment = WorkAssignment(**assignment_data.model_dump())
        result = await self.repository.create(assignment)
        await self.db.commit()
        return result

    async def get_all_assignments(
        self, filters, limit: int, offset: int
    ) -> list[WorkAssignment]:

        result = await self.repository.get_all(filters, limit, offset)

        return result

    async def get_available_work_assignments(
        self, filters, limit, offset
    ) -> list[WorkAssignment]:
        result = await self.repository.get_available(filters, limit, offset)
        return result

    async def get_assigned_assignments(self, user: User) -> list[WorkAssignment]:
        result = await self.repository.get_assigned_assignments(user)

        return result
