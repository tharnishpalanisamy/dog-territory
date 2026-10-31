from sqlalchemy.ext.asyncio import AsyncSession

from app.core import create_access_token, hash_password, verify_password
from app.exceptions import InvalidCredentialsException
from app.models import User
from app.repositories.protocols import UserProtocol
from app.schemas import (
    LoginResponse,
    RefreshTokenResponse,
    UserCreate,
    UserLogin,
    UserResponse,
)
from app.services.protocol.refresh_token_service_protocol import (
    RefreshTokenServiceProtocol,
)


class AuthService:
    def __init__(
        self,
        db: AsyncSession,
        repository: UserProtocol,
        refresh_token_service: RefreshTokenServiceProtocol,
    ) -> None:
        self.db = db
        self.repository = repository
        self.refresh_token_service = refresh_token_service

    async def authenticate_user(self, user_data: UserLogin) -> LoginResponse:
        user = await self.repository.get_by_email(user_data.email)

        if user is None:
            raise InvalidCredentialsException("Invalid Email or Password")

        if not verify_password(
            user_data.password,
            user.password_hash,
        ):
            raise InvalidCredentialsException("Invalid Email or Password")

        access_token = create_access_token(user.id)
        refresh_token = await self.refresh_token_service.issue_refresh_token(user.id)
        return LoginResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer",
            user=UserResponse(
                id=user.id,
                email=user.email,
                username=user.username,
            ),
        )

    async def signup_user(self, user_data: UserCreate) -> User:
        hashed_password = hash_password(user_data.password)

        user = User(
            email=user_data.email,
            password_hash=hashed_password,
            username=user_data.username,
        )

        result = await self.repository.create(user)
        await self.db.commit()
        return result

    async def refresh_token(self, token: str) -> RefreshTokenResponse:
        user_id, new_token = await self.refresh_token_service.rotate_refresh_token(
            token
        )

        access_token = create_access_token(user_id)

        return RefreshTokenResponse(
            access_token=access_token,
            refresh_token=new_token,
            token_type="bearer",
        )
