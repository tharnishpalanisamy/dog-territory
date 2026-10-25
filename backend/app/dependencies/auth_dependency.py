from app.database.connection import get_db 
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Depends
from app.repositories.implementation import UserRepository
from app.repositories.protocols import UserProtocol
from app.services import AuthService

import jwt

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.config import setting
from app.exceptions import UserNotFoundException



def get_user_repository(db:AsyncSession = Depends(get_db)):
    return UserRepository(db)

def get_auth_service(db:AsyncSession = Depends(get_db) , repository:UserProtocol = Depends(get_user_repository)) :
    return AuthService(db , repository)


bearer_scheme = HTTPBearer(auto_error=False)


async def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(
        bearer_scheme
    ),
    repository: UserProtocol = Depends(get_user_repository),
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    if credentials is None:
        raise credentials_exception

    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            setting.JWT_SECRET_KEY,
            algorithms=[setting.JWT_ALGORITHM],
            options={"require": ["exp", "sub"]},
        )

        subject = payload.get("sub")

        if not isinstance(subject, str) or not subject.isdecimal():
            raise credentials_exception

        user_id = int(subject)

    except jwt.InvalidTokenError:
        raise credentials_exception

    try:
        user = await repository.get_by_id(user_id)
    except UserNotFoundException:
        raise credentials_exception

    return user
