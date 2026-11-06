from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies.dog_dependency import get_dog_repository
from app.repositories.implementation import ReportsRepository
from app.repositories.protocols import DogRepositoryProtocol, ReportsRepositoryProtocol
from app.services.implementation import ReportsService
from app.services.protocol import ReportsServiceProtocol


def get_reports_repository(
    db: Annotated[AsyncSession, Depends(get_db)],
) -> ReportsRepositoryProtocol:
    return ReportsRepository(db)


def get_reports_service(
    db: Annotated[AsyncSession, Depends(get_db)],
    repository: Annotated[ReportsRepositoryProtocol, Depends(get_reports_repository)],
    dog_repository: Annotated[DogRepositoryProtocol, Depends(get_dog_repository)],
) -> ReportsServiceProtocol:
    return ReportsService(db, repository, dog_repository)
