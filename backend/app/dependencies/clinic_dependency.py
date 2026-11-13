from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.repositories.implementation import ClinicRepository
from app.repositories.protocols import ClinicRepositoryProtocol
from app.services.implementation import ClinicService
from app.services.protocol import ClinicServiceProtocol


def get_clinic_repository(
    db: Annotated[AsyncSession, Depends(get_db)],
) -> ClinicRepositoryProtocol:
    return ClinicRepository(db)


def get_clinic_service(
    db: Annotated[AsyncSession, Depends(get_db)],
    repository: Annotated[
        ClinicRepositoryProtocol,
        Depends(get_clinic_repository),
    ],
) -> ClinicServiceProtocol:
    return ClinicService(db, repository)
