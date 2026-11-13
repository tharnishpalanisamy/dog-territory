from datetime import UTC, datetime

from sqlalchemy.ext.asyncio import AsyncSession

from app.core import (
    MedicalAssignmentStatus,
    UserRole,
    VeterinarianApprovalStatus,
    VolunteerApprovalStatus,
)
from app.exceptions import (
    AssignmentNotFoundException,
    NotAuthorizedException,
    VolunteerNotApprovedException,
    VolunteerNotFoundException,
)
from app.models import MedicalAssignment, User
from app.repositories.protocols import (
    MedicalAssignmentRepositoryProtocol,
    WorkAssignmentRepositoryProtocol,
)
from app.schemas import MedicalAssignmentCreate, MedicalAssignmentFilterParams


class MedicalAssignmentService:
    def __init__(
        self,
        db: AsyncSession,
        repository: MedicalAssignmentRepositoryProtocol,
        work_assignment_repository: WorkAssignmentRepositoryProtocol | None = None,
    ):
        self.db = db
        self.repository = repository
        self.work_assignment_repository = work_assignment_repository

    async def create(
        self, data: MedicalAssignmentCreate, user: User
    ) -> MedicalAssignment:
        if user.role != UserRole.VOLUNTEER:
            raise NotAuthorizedException("Only volunteers can admit dogs to a clinic")
        await self._require_approved_volunteer(user)
        assignment = MedicalAssignment(
            **data.model_dump(),
            created_by=user.id,
            volunteer_id=user.id,
            veterinarian_id=None,
        )
        try:
            result = await self.repository.create(assignment)
            await self.db.commit()
            return result
        except Exception:
            await self.db.rollback()
            raise

    async def get_all(
        self,
        filters: MedicalAssignmentFilterParams,
        limit: int,
        offset: int,
        user: User | None = None,
    ) -> list[MedicalAssignment]:
        if user and user.role == UserRole.VETERINARIAN:
            veterinarian = await self.repository.get_veterinarian_for_user(user.id)
            if (
                veterinarian is None
                or veterinarian.approval_status != VeterinarianApprovalStatus.APPROVED
            ):
                raise NotAuthorizedException(
                    "An approved veterinarian profile is required"
                )
            filters = MedicalAssignmentFilterParams(
                **{**filters.model_dump(), "clinic_id": veterinarian.clinic_id}
            )
        elif user and user.role == UserRole.VOLUNTEER:
            await self._require_approved_volunteer(user)
            filters = MedicalAssignmentFilterParams(
                **{**filters.model_dump(), "volunteer_id": user.id}
            )
        return await self.repository.get_all(filters, limit, offset)

    async def get_by_id(self, assignment_id: int) -> MedicalAssignment:
        assignment = await self.repository.get_by_id(assignment_id)
        if assignment is None:
            raise AssignmentNotFoundException(
                f"Medical assignment with id {assignment_id} not found"
            )
        return assignment

    async def get_authorized_by_id(
        self, assignment_id: int, user: User
    ) -> MedicalAssignment:
        assignment = await self.get_by_id(assignment_id)
        if user.role == UserRole.ADMIN:
            return assignment
        if user.role == UserRole.VOLUNTEER and assignment.volunteer_id == user.id:
            await self._require_approved_volunteer(user)
            return assignment
        if user.role == UserRole.VETERINARIAN:
            veterinarian = await self.repository.get_veterinarian_for_user(user.id)
            if (
                veterinarian
                and veterinarian.approval_status == VeterinarianApprovalStatus.APPROVED
                and veterinarian.clinic_id == assignment.clinic_id
            ):
                return assignment
        raise NotAuthorizedException(
            "You are not authorized to view this medical assignment"
        )

    async def get_by_work_assignment_id(
        self, work_assignment_id: int
    ) -> list[MedicalAssignment]:
        return await self.repository.get_by_work_assignment_id(work_assignment_id)

    async def claim(self, assignment_id: int, user: User) -> MedicalAssignment:
        assignment = await self.get_by_id(assignment_id)
        veterinarian = await self.repository.get_veterinarian_for_user(user.id)
        if (
            user.role != UserRole.VETERINARIAN
            or veterinarian is None
            or veterinarian.approval_status != VeterinarianApprovalStatus.APPROVED
            or veterinarian.clinic_id != assignment.clinic_id
        ):
            raise NotAuthorizedException(
                "Only an approved veterinarian of this clinic can claim it"
            )
        if assignment.status != MedicalAssignmentStatus.OPEN:
            raise NotAuthorizedException("Only open medical assignments can be claimed")
        return await self._transition(
            assignment,
            status=MedicalAssignmentStatus.CLAIMED,
            veterinarian_id=veterinarian.id,
            claimed_at=datetime.now(UTC),
        )

    async def start(self, assignment_id: int, user: User) -> MedicalAssignment:
        assignment = await self.get_by_id(assignment_id)
        await self._require_assigned_veterinarian(assignment, user)
        if assignment.status != MedicalAssignmentStatus.CLAIMED:
            raise NotAuthorizedException("Only claimed assignments can be started")
        return await self._transition(
            assignment, status=MedicalAssignmentStatus.IN_PROGRESS
        )

    async def ready_for_pickup(
        self, assignment_id: int, user: User
    ) -> MedicalAssignment:
        assignment = await self.get_by_id(assignment_id)
        await self._require_assigned_veterinarian(assignment, user)
        if assignment.status != MedicalAssignmentStatus.IN_PROGRESS:
            raise NotAuthorizedException(
                "Only assignments in progress can be marked ready"
            )
        return await self._transition(
            assignment,
            status=MedicalAssignmentStatus.READY_FOR_PICKUP,
        )

    async def release(self, assignment_id: int, user: User) -> MedicalAssignment:
        assignment = await self.get_by_id(assignment_id)
        if user.role == UserRole.VOLUNTEER:
            await self._require_approved_volunteer(user)
        if user.role != UserRole.ADMIN and assignment.volunteer_id != user.id:
            raise NotAuthorizedException(
                "Only the assigned volunteer or an admin can release it"
            )
        if assignment.status != MedicalAssignmentStatus.READY_FOR_PICKUP:
            raise NotAuthorizedException(
                "Only assignments ready for pickup can be released"
            )
        try:
            now = datetime.now(UTC)
            assignment = await self.repository.update(
                assignment,
                {"status": MedicalAssignmentStatus.RELEASED, "completed_at": now},
            )
            if assignment.work_assignment_id and self.work_assignment_repository:
                work_assignment = await self.work_assignment_repository.get_by_id(
                    assignment.work_assignment_id
                )
                if work_assignment is not None:
                    from app.core import AssignmentStatus

                    await self.work_assignment_repository.update_status(
                        work_assignment, AssignmentStatus.COMPLETED
                    )
            await self.db.commit()
            return assignment
        except Exception:
            await self.db.rollback()
            raise

    async def cancel(self, assignment_id: int, user: User) -> MedicalAssignment:
        if user.role != UserRole.ADMIN:
            raise NotAuthorizedException("Only admins can cancel medical assignments")
        assignment = await self.get_by_id(assignment_id)
        if assignment.status in (
            MedicalAssignmentStatus.RELEASED,
            MedicalAssignmentStatus.CANCELLED,
        ):
            raise NotAuthorizedException("This medical assignment cannot be cancelled")
        return await self._transition(
            assignment, status=MedicalAssignmentStatus.CANCELLED
        )

    async def reassign(
        self, assignment_id: int, veterinarian_user_id: int, user: User
    ) -> MedicalAssignment:
        if user.role != UserRole.ADMIN:
            raise NotAuthorizedException("Only admins can reassign medical assignments")
        assignment = await self.get_by_id(assignment_id)
        veterinarian = await self.repository.get_veterinarian_for_user(
            veterinarian_user_id
        )
        if (
            veterinarian is None
            or veterinarian.approval_status != VeterinarianApprovalStatus.APPROVED
            or veterinarian.clinic_id != assignment.clinic_id
        ):
            raise NotAuthorizedException(
                "The replacement must be an approved veterinarian of this clinic"
            )
        if assignment.status in (
            MedicalAssignmentStatus.RELEASED,
            MedicalAssignmentStatus.CANCELLED,
        ):
            raise NotAuthorizedException(
                "Released or cancelled assignments cannot be reassigned"
            )
        return await self._transition(
            assignment,
            veterinarian_id=veterinarian.id,
            status=MedicalAssignmentStatus.CLAIMED,
        )

    async def _require_assigned_veterinarian(
        self, assignment: MedicalAssignment, user: User
    ) -> None:
        veterinarian = await self.repository.get_veterinarian_for_user(user.id)
        if (
            user.role != UserRole.VETERINARIAN
            or veterinarian is None
            or assignment.veterinarian_id != veterinarian.id
        ):
            raise NotAuthorizedException(
                "Only the assigned veterinarian can perform this action"
            )

    async def _transition(
        self, assignment: MedicalAssignment, **fields
    ) -> MedicalAssignment:
        try:
            result = await self.repository.update(assignment, fields)
            await self.db.commit()
            return result
        except Exception:
            await self.db.rollback()
            raise

    async def _require_approved_volunteer(self, user: User) -> None:
        volunteer = await self.repository.get_volunteer_by_user_id(user.id)
        if volunteer is None:
            raise VolunteerNotFoundException(
                "Volunteer profile associated with user is not found"
            )
        if volunteer.approval_status != VolunteerApprovalStatus.APPROVED:
            raise VolunteerNotApprovedException(
                "Volunteer approval is required to perform this action"
            )
