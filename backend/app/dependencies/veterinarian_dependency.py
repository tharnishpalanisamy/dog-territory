from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies.auth_dependency import get_user_repository
from app.dependencies.clinic_dependency import get_clinic_repository
from app.repositories.implementation import VeterinarianRepository
from app.repositories.protocols import (
    ClinicRepositoryProtocol,
    UserRepositoryProtocol,
    VeterinarianRepositoryProtocol,
)
from app.services.implementation import VeterinarianService
from app.services.protocol import VeterinarianServiceProtocol


def get_veterinarian_repository(
    db: Annotated[AsyncSession, Depends(get_db)],
) -> VeterinarianRepositoryProtocol:
    return VeterinarianRepository(db)


def get_veterinarian_service(
    db: Annotated[AsyncSession, Depends(get_db)],
    repository: Annotated[
        VeterinarianRepositoryProtocol, Depends(get_veterinarian_repository)
    ],
    clinic_repository: Annotated[
        ClinicRepositoryProtocol,
        Depends(get_clinic_repository),
    ],
    user_repository: Annotated[
        UserRepositoryProtocol, Depends(get_user_repository)
    ],
) -> VeterinarianServiceProtocol:
    return VeterinarianService(db, repository, clinic_repository, user_repository)
