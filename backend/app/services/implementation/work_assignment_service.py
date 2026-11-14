from app.core import UserRole, VolunteerApprovalStatus
from app.exceptions import (
    AssignmentAlreadyClaimedException,
    AssignmentNotFoundException,
    NotAuthorizedException,
    ReportNotFoundException,
    UserNotFoundException,
    VolunteerNotApprovedException,
    VolunteerNotFoundException,
    VolunteerServiceNotAvailable,
)
from app.models import User, WorkAssignment
from app.repositories.protocols import (
    ReportsRepositoryProtocol,
    UserRepositoryProtocol,
    VolunteerRepositoryProtocol,
    WorkAssignmentRepositoryProtocol,
    WorkAssignmentUpdateRepositoryProtocol,
)
from app.schemas import AssignAssignment, WorkAssignmentCreate, WorkAssignmentUpdate


class WorkAssignmentService:
    def __init__(
        self,
        db,
        repository: WorkAssignmentRepositoryProtocol,
        report_repository: ReportsRepositoryProtocol,
        volunteer_repository: VolunteerRepositoryProtocol,
        user_repository: UserRepositoryProtocol,
        assignment_update_repository: WorkAssignmentUpdateRepositoryProtocol,
    ):
        self.db = db
        self.repository = repository
        self.report_repository = report_repository
        self.volunteer_repository = volunteer_repository
        self.user_repository = user_repository
        self.assignment_update_repository = assignment_update_repository

    async def create_work_assignment(
        self, user: User, assignment_data: WorkAssignmentCreate
    ) -> WorkAssignment:

        if assignment_data.assigned_to is not None:
            assigned_user = await self.user_repository.get_by_id(
                assignment_data.assigned_to
            )

            if assigned_user is None:
                raise UserNotFoundException(
                    f"User with id {assignment_data.assigned_to} is not found"
                )
            if assigned_user.role != UserRole.VOLUNTEER:
                raise NotAuthorizedException(
                    "Assignments can only be assigned to volunteer users"
                )
            volunteer = await self.volunteer_repository.get_by_user_id(assigned_user.id)
            self._validate_approved_volunteer(volunteer)

        report = await self.report_repository.get_by_id(assignment_data.report_id)

        if report is None:
            raise ReportNotFoundException(
                f"Report with id {assignment_data.report_id} not found"
            )

        assignment_values = assignment_data.model_dump()
        assignment = WorkAssignment(**assignment_values)

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
        if user.role == UserRole.VOLUNTEER:
            await self.require_approved_volunteer(user)

        result = await self.repository.get_assignments_by_volunteer_id(user.id)

        return result

    async def update_assigned_to(
        self, assignment_id: int, data: AssignAssignment, user: User
    ) -> WorkAssignment:
        assignment = await self.repository.get_by_id(assignment_id)

        if assignment is None:
            raise AssignmentNotFoundException(
                f"Assignment with id {assignment_id} not found"
            )
        if assignment.assigned_to is not None:
            raise AssignmentAlreadyClaimedException(
                "Assignment has already been assigned"
            )
        assigned_user = await self.user_repository.get_by_id(data.assigned_to)

        if assigned_user is None:
            raise UserNotFoundException(f"User with id {data.assigned_to} is not found")
        if assigned_user.role != UserRole.VOLUNTEER:
            raise NotAuthorizedException(
                "Assignments can only be assigned to volunteer users"
            )

        volunteer = await self.volunteer_repository.get_by_user_id(assigned_user.id)
        if volunteer is None:
            raise VolunteerNotFoundException(
                "Volunteer profile associated with user is not found"
            )
        self._validate_approved_volunteer(volunteer)
        if assignment.report.pincode not in volunteer.service_pincodes:
            raise VolunteerServiceNotAvailable("Volunteer does not serve that location")
        result = await self.repository.update_assigned_to(
            assignment, assigned_user.id, user.id
        )

        await self.db.commit()

        return result

    async def get_assignment_by_id(self, assignment_id) -> WorkAssignment:
        result = await self.repository.get_by_id(assignment_id)

        if result is None:
            raise AssignmentNotFoundException(
                f"Work Assignment with id {assignment_id} not found"
            )
        return result

    async def claim_assignment(self, assignment_id: int, user: User) -> WorkAssignment:
        if user.role == UserRole.VOLUNTEER:
            volunteer = await self.volunteer_repository.get_by_user_id(user.id)
            self._validate_approved_volunteer(volunteer)
        assignment = await self.repository.get_by_id(assignment_id)

        if assignment is None:
            raise AssignmentNotFoundException(
                f"Work Assignment with id {assignment_id} not found"
            )

        if assignment.assigned_to is not None:
            raise AssignmentAlreadyClaimedException(
                "Work has already been understook by someone else"
            )
        result = await self.repository.claim_assignment(assignment, user.id)
        await self.db.commit()

        return result

    async def update_status(self, assignment_id, data, user) -> WorkAssignment:
        if user.role == UserRole.VOLUNTEER:
            volunteer = await self.volunteer_repository.get_by_user_id(user.id)
            self._validate_approved_volunteer(volunteer)
        assignment = await self.repository.get_by_id(assignment_id)

        if assignment is None:
            raise AssignmentNotFoundException(
                f"Work Assignment with id {assignment_id} not found"
            )

        if assignment.assigned_to != user.id:
            raise NotAuthorizedException("You are not allowed to edit this resource !")

        try:
            result = await self.repository.update_status(assignment, data.status)
            await self.db.commit()
            return result

        except Exception:
            await self.db.rollback()
            raise

    async def update_work_assignment(
        self, assignment_id: int, data: WorkAssignmentUpdate
    ) -> WorkAssignment:
        assignment = await self.get_assignment_by_id(assignment_id)
        fields = data.model_dump(exclude_unset=True)

        if "report_id" in fields:
            report = await self.report_repository.get_by_id(fields["report_id"])
            if report is None:
                raise ReportNotFoundException(
                    f"Report with id {fields['report_id']} not found"
                )

        if "assigned_to" in fields and fields["assigned_to"] is not None:
            assigned_user = await self.user_repository.get_by_id(fields["assigned_to"])
            if assigned_user is None:
                raise UserNotFoundException(
                    f"User with id {fields['assigned_to']} is not found"
                )
            if assigned_user.role != UserRole.VOLUNTEER:
                raise NotAuthorizedException(
                    "Assignments can only be assigned to volunteer users"
                )
            volunteer = await self.volunteer_repository.get_by_user_id(assigned_user.id)
            if volunteer is None:
                raise VolunteerNotFoundException(
                    "Volunteer profile associated with user is not found"
                )
            self._validate_approved_volunteer(volunteer)
            report_id = fields.get("report_id", assignment.report_id)
            report = await self.report_repository.get_by_id(report_id)
            if report is None:
                raise ReportNotFoundException(f"Report with id {report_id} not found")
            if report.pincode not in volunteer.service_pincodes:
                raise VolunteerServiceNotAvailable(
                    "Volunteer does not serve that location"
                )

        try:
            result = await self.repository.update(assignment, fields)
            await self.db.commit()
            return result
        except Exception:
            await self.db.rollback()
            raise

    async def delete_work_assignment(self, assignment_id: int) -> None:
        assignment = await self.get_assignment_by_id(assignment_id)
        try:
            await self.repository.delete(assignment)
            await self.db.commit()
        except Exception:
            await self.db.rollback()
            raise

    async def require_approved_volunteer(self, user: User) -> None:
        volunteer = await self.volunteer_repository.get_by_user_id(user.id)
        self._validate_approved_volunteer(volunteer)

    @staticmethod
    def _validate_approved_volunteer(volunteer) -> None:
        if volunteer is None:
            raise VolunteerNotFoundException(
                "Volunteer profile associated with user is not found"
            )
        if volunteer.approval_status != VolunteerApprovalStatus.APPROVED:
            raise VolunteerNotApprovedException(
                "Volunteer approval is required to perform this action"
            )
