from typing import Annotated

from app.core import limiter
from app.dependencies import (
    get_auth_service,
    get_current_user,
)
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
from fastapi import APIRouter, Depends, Request, Response, status

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.get("/me", response_model=UserResponse, status_code=status.HTTP_200_OK)
async def get_user(
    user: Annotated[User, Depends(get_current_user)],
) -> User:
    return user


@router.post("/login", response_model=LoginResponse, status_code=status.HTTP_200_OK)
@limiter.limit("5/minute")
async def login_user(
    request: Request,
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


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(
    token_data: RefreshTokenCreate,
    service: Annotated[AuthServiceProtocol, Depends(get_auth_service)],
) -> Response:
    await service.logout(token_data.refresh_token)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
