from collections.abc import Callable
from typing import Annotated

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.core import UserRole
from app.core.config import setting
from app.database.connection import get_db
from app.exceptions import NotAuthorizedException
from app.models import User
from app.repositories.implementation import RefreshTokenRepository, UserRepository
from app.repositories.protocols import RefreshTokenRepositoryProtocol, UserProtocol
from app.services import AuthService
from app.services.implementation import RefreshTokenService
from app.services.protocol import AuthServiceProtocol, RefreshTokenServiceProtocol


def get_refresh_token_repository(
    db: Annotated[AsyncSession, Depends(get_db)],
) -> RefreshTokenRepositoryProtocol:
    return RefreshTokenRepository(db)


def get_refresh_token_service(
    db: Annotated[AsyncSession, Depends(get_db)],
    repository: Annotated[
        RefreshTokenRepositoryProtocol, Depends(get_refresh_token_repository)
    ],
) -> RefreshTokenServiceProtocol:
    return RefreshTokenService(db, repository)


def get_user_repository(
    db: Annotated[AsyncSession, Depends(get_db)],
) -> UserProtocol:
    return UserRepository(db)


def get_auth_service(
    db: Annotated[AsyncSession, Depends(get_db)],
    repository: Annotated[UserProtocol, Depends(get_user_repository)],
    refresh_token_service: Annotated[
        RefreshTokenServiceProtocol, Depends(get_refresh_token_service)
    ],
) -> AuthServiceProtocol:
    return AuthService(db, repository, refresh_token_service)


bearer_scheme = HTTPBearer(auto_error=False)


async def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer_scheme)],
    repository: Annotated[UserProtocol, Depends(get_user_repository)],
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = credentials.credentials

    try:
        payload: object = jwt.decode(
            token,
            setting.JWT_SECRET_KEY,
            algorithms=[setting.JWT_ALGORITHM],
            options={"require": ["exp", "sub"]},
        )

        if not isinstance(payload, dict):
            raise credentials_exception

        subject = payload.get("sub")

        if not isinstance(subject, str) or not subject.isdecimal():
            raise credentials_exception

        try:
            user_id = int(subject)
        except ValueError:
            raise credentials_exception from None

    except jwt.InvalidTokenError:
        raise credentials_exception

    user = await repository.get_by_id(user_id)
    if user is None:
        raise credentials_exception

    return user


async def admin_required(
    user: Annotated[User, Depends(get_current_user)],
) -> User:
    if user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to access this resource",
        )
    return user


def require_roles(*allowed_roles: UserRole) -> Callable[[User], User]:

    def role_checker(
        current_user: Annotated[User, Depends(get_current_user)],
    ) -> User:
        if current_user.role not in allowed_roles:
            raise NotAuthorizedException()

        return current_user

    return role_checker
