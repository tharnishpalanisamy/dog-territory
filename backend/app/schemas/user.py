from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserCreate(BaseModel):
    username: str = Field(min_length=1, max_length=100)
    email: EmailStr = Field(max_length=255)
    password: str


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    username: str = Field(max_length=100)
    email: EmailStr = Field(max_length=255)
    role: str


class UserLocationUpdate(BaseModel):
    state: str = Field(min_length=1, max_length=100)
    district: str = Field(min_length=1, max_length=100)
    area_name: str = Field(min_length=1, max_length=150)
    pincode: str = Field(pattern=r"^\d{6}$")


class UserLocationResponse(BaseModel):
    state: str
    district: str
    area_name: str
    pincode: str


class UserProfileResponse(UserResponse):
    created_at: datetime | None = None
    state: str | None = None
    district: str | None = None
    area_name: str | None = None
    pincode: str | None = None


