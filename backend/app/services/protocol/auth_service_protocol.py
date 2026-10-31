from typing import Protocol, TypedDict

from app.models import User
from app.schemas.auth import UserCreate, UserLogin


class AuthenticatedUser(TypedDict):
    id: int
    email: str
    username: str


class LoginResponse(TypedDict):
    access_token: str
    refresh_token: str
    token_type: str
    user: AuthenticatedUser


class RefreshResponse(TypedDict):
    access_token: str
    refresh_token: str
    token_type: str


class AuthServiceProtocol(Protocol):
    async def authenticate_user(self, user_data: UserLogin) -> LoginResponse: ...

    async def signup_user(self, user_data: UserCreate) -> User: ...

    async def refresh_token(self, token: str) -> RefreshResponse: ...
