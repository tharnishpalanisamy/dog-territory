from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.repositories.implementation import UserRepository
from app.repositories.protocols import UserRepositoryProtocol
from app.services.implementation import UserService
from app.services.protocol import UserServiceProtocol


def get_user_repository(
    db: Annotated[AsyncSession, Depends(get_db)],
) -> UserRepositoryProtocol:
    return UserRepository(db)


def get_user_service(
    db: Annotated[AsyncSession, Depends(get_db)],
    repository: Annotated[UserRepositoryProtocol, Depends(get_user_repository)],
) -> UserServiceProtocol:
    return UserService(db, repository)
