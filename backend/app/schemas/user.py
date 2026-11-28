from datetime import datetime

import re

from pydantic import (
    BaseModel,
    ConfigDict,
    EmailStr,
    Field,
    field_validator,
    model_validator,
)


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
    location: "UserLocationResponse | None" = None

    @model_validator(mode="before")
    @classmethod
    def build_location_from_user_fields(cls, value: object) -> object:
        # User stores location fields as columns, while the API exposes them
        # as one nested object. Ensure /auth/me restores the same shape as login.
        if isinstance(value, dict):
            data = value.copy()
            get_value = data.get
        else:
            def get_value(key, default=None):
                return getattr(value, key, default)

            data = {
                "id": get_value("id"),
                "username": get_value("username"),
                "email": get_value("email"),
                "role": get_value("role"),
                "location": get_value("location"),
            }

        if not data.get("location"):
            location = {
                "state": get_value("state"),
                "district": get_value("district"),
                "area_name": get_value("area_name"),
                "pincode": get_value("pincode"),
            }
            if any(location.values()):
                data["location"] = location
        return data


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
    phone_number: str | None = None
    created_at: datetime | None = None
    state: str | None = None
    district: str | None = None
    area_name: str | None = None
    pincode: str | None = None


class UserPhoneNumberUpdate(BaseModel):
    phone_number: str | None = Field(max_length=20)

    @field_validator("phone_number")
    @classmethod
    def validate_phone_number(cls, value: str | None) -> str | None:
        if value is None:
            return value
        normalized = re.sub(r"[\s()-]", "", value)
        if not re.fullmatch(r"(?:\+91)?[6-9]\d{9}", normalized):
            raise ValueError("Enter a valid Indian phone number")
        return normalized if normalized.startswith("+91") else f"+91{normalized}"


class UserProfileUpdate(BaseModel):
    username: str | None = Field(default=None, min_length=1, max_length=100)
    phone_number: str | None = Field(default=None, max_length=20)

    @field_validator("username")
    @classmethod
    def validate_username(cls, value: str | None) -> str | None:
        if value is None:
            return value
        normalized = value.strip()
        if not normalized:
            raise ValueError("Username cannot be blank")
        return normalized

    @field_validator("phone_number")
    @classmethod
    def validate_profile_phone_number(cls, value: str | None) -> str | None:
        if value is None:
            return value
        normalized = re.sub(r"[\s()-]", "", value)
        if not re.fullmatch(r"(?:\+91)?[6-9]\d{9}", normalized):
            raise ValueError("Enter a valid Indian phone number")
        return normalized if normalized.startswith("+91") else f"+91{normalized}"


