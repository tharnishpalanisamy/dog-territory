from sqlalchemy.ext.asyncio import AsyncSession

from app.core import UserRole, VeterinarianApprovalStatus
from app.exceptions import AssignmentNotFoundException, AssignmentUpdateNotFoundException, NotAuthorizedException
from app.models import MedicalAssignmentUpdate, User
from app.repositories.protocols import (
    MedicalAssignmentRepositoryProtocol,
    MedicalAssignmentUpdateRepositoryProtocol,
)


class MedicalAssignmentUpdateService:
    def __init__(self, db: AsyncSession, repository: MedicalAssignmentUpdateRepositoryProtocol,
                 assignment_repository: MedicalAssignmentRepositoryProtocol):
        self.db = db
        self.repository = repository
        self.assignment_repository = assignment_repository

    async def get_update_by_id(self, update_id: int) -> MedicalAssignmentUpdate:
        update = await self.repository.get_by_id(update_id)
        if update is None:
            raise AssignmentUpdateNotFoundException(f"Medical assignment update {update_id} not found")
        return update

    async def get_updates(self, assignment_id: int) -> list[MedicalAssignmentUpdate]:
        assignment = await self.assignment_repository.get_by_id(assignment_id)
        if assignment is None:
            raise AssignmentNotFoundException(f"Medical assignment {assignment_id} not found")
        return await self.repository.get_by_assignment_id(assignment_id)

    async def get_update_for_user(self, update_id: int, user: User) -> MedicalAssignmentUpdate:
        update = await self.get_update_by_id(update_id)
        assignment = await self.assignment_repository.get_by_id(update.medical_assignment_id)
        if assignment is None:
            raise AssignmentNotFoundException(
                f"Medical assignment {update.medical_assignment_id} not found"
            )
        if user.role == UserRole.ADMIN:
            return update
        if user.role == UserRole.VOLUNTEER and assignment.volunteer_id == user.id:
            return update
        if user.role == UserRole.VETERINARIAN:
            veterinarian = await self.assignment_repository.get_veterinarian_for_user(user.id)
            if (veterinarian
                    and veterinarian.approval_status == VeterinarianApprovalStatus.APPROVED
                    and veterinarian.clinic_id == assignment.clinic_id):
                return update
        raise NotAuthorizedException("You are not authorized to view this medical assignment update")

    async def create_update(self, assignment_id: int, data, user: User) -> MedicalAssignmentUpdate:
        assignment = await self.assignment_repository.get_by_id(assignment_id)
        if assignment is None:
            raise AssignmentNotFoundException(f"Medical assignment {assignment_id} not found")
        veterinarian = await self.assignment_repository.get_veterinarian_for_user(user.id)
        if (user.role != UserRole.VETERINARIAN or veterinarian is None
                or veterinarian.approval_status != VeterinarianApprovalStatus.APPROVED
                or assignment.veterinarian_id != veterinarian.id):
            raise NotAuthorizedException("Only the assigned veterinarian can add treatment updates")
        update = MedicalAssignmentUpdate(
            medical_assignment_id=assignment_id,
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

    async def update_update(self, update_id: int, data, user: User) -> MedicalAssignmentUpdate:
        update = await self.get_update_by_id(update_id)
        assignment = await self.assignment_repository.get_by_id(update.medical_assignment_id)
        veterinarian = await self.assignment_repository.get_veterinarian_for_user(user.id)
        if (user.role != UserRole.VETERINARIAN or update.updated_by != user.id
                or assignment is None or veterinarian is None
                or veterinarian.approval_status != VeterinarianApprovalStatus.APPROVED
                or assignment.veterinarian_id != veterinarian.id):
            raise NotAuthorizedException("Only the assigned veterinarian who authored it can edit this update")
        try:
            result = await self.repository.update(
                update, data.model_dump(exclude_unset=True)
            )
            await self.db.commit()
            return result
        except Exception:
            await self.db.rollback()
            raise

    async def delete_update(self, update_id: int, user: User) -> None:
        if user.role != UserRole.ADMIN:
            raise NotAuthorizedException("Only admins can delete medical assignment updates")
        update = await self.get_update_by_id(update_id)
        try:
            await self.repository.delete(update)
            await self.db.commit()
        except Exception:
            await self.db.rollback()
            raise
