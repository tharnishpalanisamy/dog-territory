from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.repositories.implementation import DogRepository
from app.repositories.protocols import DogRepositoryProtocol
from app.services.implementation import DogService
from app.services.protocol import DogServiceProtocol


def get_dog_repository(
    db: Annotated[AsyncSession, Depends(get_db)],
) -> DogRepositoryProtocol:
    return DogRepository(db)


def get_dog_service(
    db: Annotated[AsyncSession, Depends(get_db)],
    repository: Annotated[DogRepositoryProtocol, Depends(get_dog_repository)],
) -> DogServiceProtocol:
    return DogService(db, repository)
