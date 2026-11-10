from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies.auth_dependency import get_user_repository
from app.repositories.implementation import VolunteerRepository
from app.repositories.protocols import (
    UserRepositoryProtocol,
    VolunteerRepositoryProtocol,
)
from app.services.implementation import VolunteerService
from app.services.protocol import VolunteerServiceProtocol


def get_volunteer_repository(
    db: Annotated[AsyncSession, Depends(get_db)],
) -> VolunteerRepositoryProtocol:
    return VolunteerRepository(db)


def get_volunteer_service(
    db: Annotated[AsyncSession, Depends(get_db)],
    repository: Annotated[
        VolunteerRepositoryProtocol,
        Depends(get_volunteer_repository),
    ],
    user_repository: Annotated[
        UserRepositoryProtocol,
        Depends(get_user_repository),
    ],
) -> VolunteerServiceProtocol:
    return VolunteerService(db, repository, user_repository)
