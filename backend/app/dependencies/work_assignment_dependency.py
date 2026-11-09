from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies.reports_dependency import get_reports_repository
from app.repositories.implementation import WorkAssignmentRepository
from app.repositories.protocols import (
    ReportsRepositoryProtocol,
    WorkAssignmentRepositoryProtocol,
)
from app.services.implementation import WorkAssignmentService
from app.services.protocol import WorkAssignmentServiceProtocol


def get_work_assignment_repository(
    db: Annotated[AsyncSession, Depends(get_db)],
) -> WorkAssignmentRepositoryProtocol:
    return WorkAssignmentRepository(db)


def get_work_assignment_service(
    db: Annotated[AsyncSession, Depends(get_db)],
    repository: Annotated[
        WorkAssignmentRepositoryProtocol, Depends(get_work_assignment_repository)
    ],
    report_repository: Annotated[
        ReportsRepositoryProtocol, Depends(get_reports_repository)
    ],
) -> WorkAssignmentServiceProtocol:

    return WorkAssignmentService(db, repository, report_repository)
