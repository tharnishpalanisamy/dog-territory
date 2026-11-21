from typing import Protocol

from app.models import User
from app.schemas import (
    ForgotPasswordRequest,
    LoginResponse,
    RefreshTokenResponse,
    UserCreate,
    UserLogin,
)


class AuthServiceProtocol(Protocol):
    async def authenticate_user(self, user_data: UserLogin) -> LoginResponse: ...

    async def signup_user(self, user_data: UserCreate) -> User: ...

    async def refresh_token(self, token: str) -> RefreshTokenResponse: ...

    async def request_password_reset(self, data: ForgotPasswordRequest): ...

    async def verify_reset_otp(self, data): ...

    async def reset_password(self, data): ...

    async def logout(self, token: str) -> None: ...
