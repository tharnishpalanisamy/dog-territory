from typing import Protocol

from app.models import User
from app.schemas import (
    LoginResponse,
    RefreshTokenResponse,
    UserCreate,
    UserLogin,
)


class AuthServiceProtocol(Protocol):
    async def authenticate_user(self, user_data: UserLogin) -> LoginResponse: ...

    async def signup_user(self, user_data: UserCreate) -> User: ...

    async def refresh_token(self, token: str) -> RefreshTokenResponse: ...
