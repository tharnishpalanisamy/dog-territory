from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies.auth_dependency import get_user_repository
from app.dependencies.reports_dependency import get_reports_repository
from app.dependencies.volunteers_dependency import get_volunteer_repository
from app.repositories.implementation import (
    AssignmentUpdateRepository,
    WorkAssignmentRepository,
)
from app.repositories.protocols import (
    AssignmentUpdateRepositoryProtocol,
    ReportsRepositoryProtocol,
    UserRepositoryProtocol,
    VolunteerRepositoryProtocol,
    WorkAssignmentRepositoryProtocol,
)
from app.services.implementation import WorkAssignmentService
from app.services.protocol import WorkAssignmentServiceProtocol


def get_work_assignment_repository(
    db: Annotated[AsyncSession, Depends(get_db)],
) -> WorkAssignmentRepositoryProtocol:
    return WorkAssignmentRepository(db)


def get_assignment_update_repository(
    db: Annotated[AsyncSession, Depends(get_db)],
) -> AssignmentUpdateRepositoryProtocol:
    return AssignmentUpdateRepository(db)


def get_work_assignment_service(
    db: Annotated[AsyncSession, Depends(get_db)],
    repository: Annotated[
        WorkAssignmentRepositoryProtocol, Depends(get_work_assignment_repository)
    ],
    report_repository: Annotated[
        ReportsRepositoryProtocol, Depends(get_reports_repository)
    ],
    volunteer_repository: Annotated[
        VolunteerRepositoryProtocol, Depends(get_volunteer_repository)
    ],
    user_repository: Annotated[UserRepositoryProtocol, Depends(get_user_repository)],
    assignment_update_repository: Annotated[
        AssignmentUpdateRepositoryProtocol, Depends(get_assignment_update_repository)
    ],
) -> WorkAssignmentServiceProtocol:

    return WorkAssignmentService(
        db,
        repository,
        report_repository,
        volunteer_repository,
        user_repository,
        assignment_update_repository,
    )
