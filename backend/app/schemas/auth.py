from pydantic import BaseModel, Field


class UserLogin(BaseModel):
    email: str
    password: str


class UserCreate(BaseModel):
    username: str
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class RefreshTokenCreate(BaseModel):
    refresh_token: str = Field(min_length=86, max_length=86)


class RefreshTokenReponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str
