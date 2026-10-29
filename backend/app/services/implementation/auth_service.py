from app.core import create_access_token, hash_password, verify_password
from app.exceptions import InvalidCredentialsException, InvalidRefreshTokenException
from app.models.user import User


class AuthService:
    def __init__(self, db, repository, refresh_token_service):
        self.db = db
        self.repository = repository
        self.refresh_token_service = refresh_token_service

    async def authenticate_user(self, user_data):
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
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "email": user.email,
                "username": user.username,
            },
        }

    async def signup_user(self, user_data):
        hashed_password = hash_password(user_data.password)

        user = User(
            email=user_data.email,
            password_hash=hashed_password,
            username=user_data.username,
        )

        return await self.repository.create(user)

    async def refresh_token(self, token):
        user_id, new_token = await self.refresh_token_service.rotate_refresh_token(token)

        if user_id is None:
            raise InvalidRefreshTokenException()

        access_token = create_access_token(user_id) 

        return {
            'access_token' : access_token , 
            'refresh_token' : new_token , 
            'token_type' : 'bearer'
        }
