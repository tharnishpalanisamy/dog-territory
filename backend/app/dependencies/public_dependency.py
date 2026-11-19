from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies.dog_dependency import get_dog_repository
from app.dependencies.reports_dependency import get_reports_repository
from app.dependencies.volunteers_dependency import get_volunteer_repository
from app.repositories.implementation import (
    VolunteerRepository,
)
from app.repositories.protocols import (
    DogRepositoryProtocol,
    ReportsRepositoryProtocol,
)
from app.services.implementation import PublicService


def get_public_service(
    db: Annotated[AsyncSession, Depends(get_db)],
    dog_repository: Annotated[DogRepositoryProtocol, Depends(get_dog_repository)],
    volunteer_repository: Annotated[
        VolunteerRepository, Depends(get_volunteer_repository)
    ],
    reports_repository: Annotated[
        ReportsRepositoryProtocol, Depends(get_reports_repository)
    ],
):
    return PublicService(
        db=db,
        dog_repository=dog_repository,
        volunteer_repository=volunteer_repository,
        reports_repository=reports_repository,
    )
