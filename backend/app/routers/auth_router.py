from typing import Annotated

from fastapi import APIRouter, Depends

from app.dependencies import admin_required, get_auth_service
from app.models import User
from app.schemas import RefreshTokenCreate, RefreshTokenReponse
from app.schemas.auth import UserCreate, UserLogin
from app.services.protocol import AuthServiceProtocol
from app.services.protocol.auth_service_protocol import LoginResponse, RefreshResponse

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.get("/me")
async def get_user(
    user: Annotated[User, Depends(admin_required)],
) -> dict[str, bool]:
    return {"check": True}


@router.post("/login")
async def login_user(
    login_data: UserLogin,
    service: Annotated[AuthServiceProtocol, Depends(get_auth_service)],
) -> LoginResponse:
    auth_services = service
    return await auth_services.authenticate_user(login_data)


@router.post("/signup", response_model=None)
async def signup_user(
    signup_data: UserCreate,
    service: Annotated[AuthServiceProtocol, Depends(get_auth_service)],
) -> User:
    auth_services = service
    return await auth_services.signup_user(signup_data)


@router.post("/refresh", response_model=RefreshTokenReponse)
async def refresh_token(
    token_data: RefreshTokenCreate,
    service: Annotated[AuthServiceProtocol, Depends(get_auth_service)],
) -> RefreshResponse:
    return await service.refresh_token(token_data.refresh_token)
