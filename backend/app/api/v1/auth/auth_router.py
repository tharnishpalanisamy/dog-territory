from typing import Annotated

from app.core import limiter
from app.dependencies import (
    get_auth_service,
    get_current_user,
    get_password_reset_service,
)
from app.models import User
from app.schemas import (
    ForgotPasswordRequest,
    LoginUserResponse,
    RefreshTokenResponse,
    UserCreate,
    UserLogin,
    UserResponse,
    UserRefreshTokenResponse,
)
from app.services.protocol import AuthServiceProtocol, PasswordResetServiceProtocol
from app.utilities import clear_refresh_cookie, set_refresh_cookie
from fastapi import APIRouter, Cookie, Depends, HTTPException, Request, Response, status

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.get("/me", response_model=UserResponse, status_code=status.HTTP_200_OK)
async def get_user(
    user: Annotated[User, Depends(get_current_user)],
) -> User:
    return user


@router.post("/login", response_model=LoginUserResponse, status_code=status.HTTP_200_OK)
@limiter.limit("5/minute")
async def login_user(
    request: Request,
    response: Response,
    login_data: UserLogin,
    service: Annotated[AuthServiceProtocol, Depends(get_auth_service)],
) -> LoginUserResponse:
    result = await service.authenticate_user(login_data)
    set_refresh_cookie(response, result.refresh_token)
    return {
        "access_token": result.access_token,
        "token_type": result.token_type,
        "user": result.user,
    }


@router.post(
    "/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED
)
async def signup_user(
    signup_data: UserCreate,
    service: Annotated[AuthServiceProtocol, Depends(get_auth_service)],
) -> User:

    return await service.signup_user(signup_data)


@router.post(
    "/refresh",
    response_model=UserRefreshTokenResponse,
    status_code=status.HTTP_201_CREATED,
)
async def refresh_token(
    response: Response,
    service: Annotated[AuthServiceProtocol, Depends(get_auth_service)],
    refresh_token: str | None = Cookie(default=None, alias="refresh_token"),
) -> UserRefreshTokenResponse:
    if not refresh_token:
        raise HTTPException(
            status_code=401,
            detail="Refresh token missing",
        )
    result = await service.refresh_token(refresh_token)
    set_refresh_cookie(response, result.refresh_token)
    return {
        "access_token": result.access_token,
    }


@router.post("/forgot-password", status_code=status.HTTP_202_ACCEPTED)
async def forgot_password(
    forgot_password_request: ForgotPasswordRequest,
    service: Annotated[
        PasswordResetServiceProtocol, Depends(get_password_reset_service)
    ],
):
    return await service.request_password_reset(forgot_password_request)


@router.post("/verify-reset-otp")
async def verify_reset_otp(
    reset_otp_request,
    service: Annotated[
        PasswordResetServiceProtocol, Depends(get_password_reset_service)
    ],
):
    return 1


@router.post("/reset-password")
async def reset_password(
    reset_password_request,
    service: Annotated[
        PasswordResetServiceProtocol, Depends(get_password_reset_service)
    ],
):
    return 1


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(
    response: Response,
    service: Annotated[AuthServiceProtocol, Depends(get_auth_service)],
    refresh_token: str | None = Cookie(default=None, alias="refresh_token"),
) -> Response:

    if refresh_token:
        await service.logout(refresh_token)
    clear_refresh_cookie(response)
    return {"message": "Successfully logged out"}
