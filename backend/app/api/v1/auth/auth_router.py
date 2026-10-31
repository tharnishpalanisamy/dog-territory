from typing import Annotated

from app.dependencies import admin_required, get_auth_service
from app.models import User
from app.schemas import (
    LoginResponse,
    RefreshTokenCreate,
    RefreshTokenResponse,
    UserCreate,
    UserLogin,
    UserResponse,
)
from app.services.protocol import AuthServiceProtocol
from fastapi import APIRouter, Depends, status

router = APIRouter(prefix="/api/v1/auth", tags=["Authentication"])


@router.get("/me", response_model=UserResponse, status_code=status.HTTP_200_OK)
async def get_user(
    user: Annotated[User, Depends(admin_required)],
) -> User:
    return user


@router.post("/login", response_model=LoginResponse, status_code=status.HTTP_200_OK)
async def login_user(
    login_data: UserLogin,
    service: Annotated[AuthServiceProtocol, Depends(get_auth_service)],
) -> LoginResponse:
    auth_services = service
    return await auth_services.authenticate_user(login_data)


@router.post(
    "/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED
)
async def signup_user(
    signup_data: UserCreate,
    service: Annotated[AuthServiceProtocol, Depends(get_auth_service)],
) -> User:
    auth_services = service
    return await auth_services.signup_user(signup_data)


@router.post(
    "/refresh", response_model=RefreshTokenResponse, status_code=status.HTTP_201_CREATED
)
async def refresh_token(
    token_data: RefreshTokenCreate,
    service: Annotated[AuthServiceProtocol, Depends(get_auth_service)],
) -> RefreshTokenResponse:
    return await service.refresh_token(token_data.refresh_token)
