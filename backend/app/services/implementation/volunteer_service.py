from sqlalchemy.ext.asyncio import AsyncSession

from app.core import UserRole

# Use your project's existing custom exceptions here.
from app.exceptions import (
    UserNotFoundException,
    VolunteerAlreadyExistsException,
    VolunteerNotFoundException,
)
from app.models import Volunteer
from app.repositories.protocols import (
    UserRepositoryProtocol,
    VolunteerRepositoryProtocol,
)
from app.schemas.volunteer import (
    VolunteerApprovalUpdate,
    VolunteerCreate,
    VolunteerUpdate,
)
from app.services.protocol import VolunteerServiceProtocol


class VolunteerService(VolunteerServiceProtocol):
    def __init__(
        self,
        db: AsyncSession,
        repository: VolunteerRepositoryProtocol,
        user_repository: UserRepositoryProtocol,
    ):
        self.db = db
        self.repository = repository
        self.user_repository = user_repository

    async def create_profile(self, user_id: int, data: VolunteerCreate) -> Volunteer:

        user = await self.user_repository.get_by_id(user_id)

        if user is None:
            raise UserNotFoundException()

        existing = await self.repository.get_by_user_id(user_id)

        if existing:
            raise VolunteerAlreadyExistsException()

        try:
            volunteer = Volunteer(
                user_id=user_id,
                **data.model_dump(),
            )

            volunteer = await self.repository.create(volunteer)

            user.role = UserRole.VOLUNTEER

            await self.db.commit()

            return volunteer

        except Exception:
            await self.db.rollback()
            raise

    async def get_by_user_id(self, user_id: int) -> Volunteer:

        volunteer = await self.repository.get_by_user_id(user_id)

        if volunteer is None:
            raise VolunteerNotFoundException()

        return volunteer

    async def update_profile(self, user_id: int, data: VolunteerUpdate) -> Volunteer:

        volunteer = await self.get_by_user_id(user_id)

        try:
            update_data = data.model_dump(exclude_unset=True)

            await self.repository.update(volunteer, update_data)

            await self.db.commit()

            return volunteer

        except Exception:
            await self.db.rollback()
            raise

    async def get_all(self, limit: int, offset: int):

        return await self.repository.get_all(
            limit=limit,
            offset=offset,
        )

    async def get_by_id(self, volunteer_id: int) -> Volunteer:

        volunteer = await self.repository.get_by_id(volunteer_id)

        if volunteer is None:
            raise VolunteerNotFoundException()

        return volunteer

    async def update_approval(
        self,
        volunteer_id: int,
        data: VolunteerApprovalUpdate,
    ) -> Volunteer:

        volunteer = await self.get_by_id(volunteer_id)

        try:
            await self.repository.update(
                volunteer,
                data.model_dump(),
            )

            await self.db.commit()

            return volunteer

        except Exception:
            await self.db.rollback()
            raise

    async def delete(self, volunteer_id: int) -> None:

        volunteer = await self.get_by_id(volunteer_id)

        user = await self.user_repository.get_by_id(volunteer.user_id)

        try:
            await self.repository.delete(volunteer)

            if user:
                user.role = UserRole.USER

            await self.db.commit()

        except Exception:
            await self.db.rollback()
            raise
