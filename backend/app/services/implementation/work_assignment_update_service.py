from sqlalchemy.ext.asyncio import AsyncSession

from app.core import UserRole
from app.exceptions import (
    AssignmentNotFoundException,
    AssignmentUpdateNotFoundException,
    NotAuthorizedException,
)
from app.models import AssignmentUpdate, MedicalAssignment, User
from app.repositories.protocols import (
    MedicalAssignmentRepositoryProtocol,
    WorkAssignmentRepositoryProtocol,
    WorkAssignmentUpdateRepositoryProtocol,
)
from app.schemas import AssignmentUpdateCreate, AssignmentUpdatePatch


class WorkAssignmentUpdateService:
    def __init__(
        self,
        db: AsyncSession,
        repository: WorkAssignmentUpdateRepositoryProtocol,
        work_assignment_repository: WorkAssignmentRepositoryProtocol,
        medical_assignment_repository: MedicalAssignmentRepositoryProtocol,
    ):
        self.db = db
        self.repository = repository
        self.work_assignment_repository = work_assignment_repository
        self.medical_assignment_repository = medical_assignment_repository

    async def get_all_updates(
        self, filters, limit: int, offset: int
    ) -> list[AssignmentUpdate]:
        return await self.repository.get_all(filters, limit, offset)

    async def get_update_by_id(self, update_id: int) -> AssignmentUpdate:
        update = await self.repository.get_by_id(update_id)
        if update is None:
            raise AssignmentUpdateNotFoundException(
                f"Assignment update with id {update_id} not found"
            )
        return update

    async def get_updates_by_assignment_id(
        self, assignment_id: int
    ) -> list[AssignmentUpdate]:
        assignment = await self.work_assignment_repository.get_by_id(assignment_id)
        if assignment is None:
            raise AssignmentNotFoundException(
                f"Assignment with id {assignment_id} not found"
            )
        return await self.repository.get_by_assignment_id(assignment_id)

    async def _get_owned_update(self, update_id: int, user: User) -> AssignmentUpdate:
        update = await self.get_update_by_id(update_id)
        if user.role != UserRole.ADMIN and update.updated_by != user.id:
            raise NotAuthorizedException("You can only edit or delete your own updates")
        return update

    async def update_update(
        self, update_id: int, data: AssignmentUpdatePatch, user: User
    ) -> AssignmentUpdate:
        update = await self._get_owned_update(update_id, user)
        fields = data.model_dump(exclude_unset=True)
        try:
            result = await self.repository.update(update, fields)
            await self.db.commit()
            return result
        except Exception:
            await self.db.rollback()
            raise

    async def delete_update(self, update_id: int, user: User) -> None:
        update = await self._get_owned_update(update_id, user)
        try:
            await self.repository.delete(update)
            await self.db.commit()
        except Exception:
            await self.db.rollback()
            raise

    async def create_update(
        self, data: AssignmentUpdateCreate, user: User
    ) -> AssignmentUpdate:
        assignment_id = data.assignment_id
        assignment = await self.work_assignment_repository.get_by_id(assignment_id)
        if assignment is None:
            raise AssignmentNotFoundException(
                f"Assignment with id {assignment_id} not found"
            )

        update = AssignmentUpdate(
            assignment_id=assignment_id,
            updated_by=user.id,
            update_type=data.update_type,
            description=data.description,
        )

        try:
            result = await self.repository.create(update)
            await self.db.commit()
            return result
        except Exception:
            await self.db.rollback()
            raise

    async def create_clinic_admission(self, assignment_id, data, user):
        assignment = await self.work_assignment_repository.get_by_id(assignment_id)

        if assignment is None:
            raise AssignmentNotFoundException(
                f"Assignment with id {assignment_id} not found "
            )
        volunteer = ""
        medical_assignment = MedicalAssignment(
            dog_id=assignment.report.dog_id,
            work_assignment_id=assignment.id,
            clinic_id=data.clinic_id,
            created_by=user.id,
            volunteer_id=volunteer.id,
            title=data.title,
            mode=data.mode,
            status=data.status,
        )
        result = await self.medical_assignment_repository.create(medical_assignment)
        await self.db.commit()
        return result
