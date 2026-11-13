from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies.auth_dependency import get_user_repository
from app.dependencies.medical_assignment_rependecny import (
    get_medical_assignment_repository,
)
from app.dependencies.reports_dependency import get_reports_repository
from app.dependencies.volunteers_dependency import get_volunteer_repository
from app.repositories.implementation import (
    WorkAssignmentRepository,
    WorkAssignmentUpdateRepository,
)
from app.repositories.protocols import (
    MedicalAssignmentRepositoryProtocol,
    ReportsRepositoryProtocol,
    UserRepositoryProtocol,
    VolunteerRepositoryProtocol,
    WorkAssignmentRepositoryProtocol,
    WorkAssignmentUpdateRepositoryProtocol,
)
from app.services.implementation import (
    WorkAssignmentService,
    WorkAssignmentUpdateService,
)
from app.services.protocol import (
    WorkAssignmentServiceProtocol,
    WorkAssignmentUpdateServiceProtocol,
)


def get_work_assignment_repository(
    db: Annotated[AsyncSession, Depends(get_db)],
) -> WorkAssignmentRepositoryProtocol:
    return WorkAssignmentRepository(db)


def get_work_assignment_update_repository(
    db: Annotated[AsyncSession, Depends(get_db)],
) -> WorkAssignmentUpdateRepositoryProtocol:
    return WorkAssignmentUpdateRepository(db)


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
        WorkAssignmentUpdateRepositoryProtocol,
        Depends(get_work_assignment_update_repository),
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


def get_work_assignment_update_service(
    db: Annotated[AsyncSession, Depends(get_db)],
    repository: Annotated[
        WorkAssignmentUpdateRepositoryProtocol,
        Depends(get_work_assignment_update_repository),
    ],
    work_assignment_repository: Annotated[
        WorkAssignmentRepositoryProtocol,
        Depends(get_work_assignment_repository),
    ],
    medical_assignment_repository: Annotated[
        MedicalAssignmentRepositoryProtocol, Depends(get_medical_assignment_repository)
    ],
) -> WorkAssignmentUpdateServiceProtocol:
    return WorkAssignmentUpdateService(
        db, repository, work_assignment_repository, medical_assignment_repository
    )
