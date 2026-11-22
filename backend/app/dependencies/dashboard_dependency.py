from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.repositories.implementation import DashboardRepository
from app.repositories.protocols import DashboardRepositoryProtocol
from app.services.implementation import DashboardService
from app.services.protocol import DashboardServiceProtocol


def get_dashboard_repository(
    db: Annotated[AsyncSession, Depends(get_db)],
) -> DashboardRepositoryProtocol:
    return DashboardRepository(db)


def get_dashboard_service(
    db: Annotated[AsyncSession, Depends(get_db)],
    repository: Annotated[
        DashboardRepositoryProtocol, Depends(get_dashboard_repository)
    ],
) -> DashboardServiceProtocol:
    return DashboardService(db, repository)
