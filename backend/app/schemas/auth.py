from pydantic import BaseModel, EmailStr, Field

from app.schemas.user import UserResponse


class UserLogin(BaseModel):
    email: EmailStr = Field(max_length=255)
    password: str


class LoginResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str
    user: UserResponse


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class RefreshTokenCreate(BaseModel):
    refresh_token: str


class RefreshTokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str
