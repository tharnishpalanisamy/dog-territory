from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies.auth_dependency import get_user_repository
from app.repositories.implementation import PasswordResetRepository
from app.repositories.protocols import (
    PasswordResetRepositoryProtocol,
    UserRepositoryProtocol,
)
from app.services.implementation import PasswordResetService
from app.services.protocol import PasswordResetServiceProtocol


def get_password_reset_repository(
    db: Annotated[AsyncSession, Depends(get_db)],
) -> PasswordResetRepositoryProtocol:
    return PasswordResetRepository(db)


def get_password_reset_service(
    db: Annotated[AsyncSession, Depends(get_db)],
    password_reset_repository: Annotated[
        PasswordResetRepositoryProtocol, Depends(get_password_reset_repository)
    ],
    user_repository: Annotated[UserRepositoryProtocol, Depends(get_user_repository)],
) -> PasswordResetServiceProtocol:
    return PasswordResetService(db, password_reset_repository, user_repository)
