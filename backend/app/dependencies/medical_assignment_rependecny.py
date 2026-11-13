from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.repositories.implementation import (
    MedicalAssignmentRepository,
    MedicalAssignmentUpdateRepository,
    WorkAssignmentRepository,
)
from app.repositories.protocols import (
    MedicalAssignmentRepositoryProtocol,
    MedicalAssignmentUpdateRepositoryProtocol,
    WorkAssignmentRepositoryProtocol,
)
from app.services.implementation import MedicalAssignmentService, MedicalAssignmentUpdateService
from app.services.protocol import MedicalAssignmentServiceProtocol, MedicalAssignmentUpdateServiceProtocol


def get_work_assignment_repository(
    db: Annotated[AsyncSession, Depends(get_db)],
) -> WorkAssignmentRepositoryProtocol:
    return WorkAssignmentRepository(db)


def get_medical_assignment_repository(
    db: Annotated[AsyncSession, Depends(get_db)],
) -> MedicalAssignmentRepositoryProtocol:
    return MedicalAssignmentRepository(db)


def get_medical_assignment_service(
    db: Annotated[AsyncSession, Depends(get_db)],
    repository: Annotated[
        MedicalAssignmentRepositoryProtocol,
        Depends(get_medical_assignment_repository),
    ],
    work_assignment_repository: Annotated[
        WorkAssignmentRepositoryProtocol,
        Depends(get_work_assignment_repository),
    ],
) -> MedicalAssignmentServiceProtocol:
    return MedicalAssignmentService(db, repository, work_assignment_repository)


def get_medical_assignment_update_repository(
    db: Annotated[AsyncSession, Depends(get_db)],
) -> MedicalAssignmentUpdateRepositoryProtocol:
    return MedicalAssignmentUpdateRepository(db)


def get_medical_assignment_update_service(
    db: Annotated[AsyncSession, Depends(get_db)],
    repository: Annotated[
        MedicalAssignmentUpdateRepositoryProtocol,
        Depends(get_medical_assignment_update_repository),
    ],
    assignment_repository: Annotated[
        MedicalAssignmentRepositoryProtocol,
        Depends(get_medical_assignment_repository),
    ],
) -> MedicalAssignmentUpdateServiceProtocol:
    return MedicalAssignmentUpdateService(db, repository, assignment_repository)
