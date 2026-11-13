from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class ClinicCreate(BaseModel):
    name: str = Field(min_length=2, max_length=150)
    address: str = Field(min_length=1)
    city: str = Field(min_length=2, max_length=100)
    state: str = Field(min_length=2, max_length=100)
    pincode: str = Field(min_length=1, max_length=10)
    phone: str = Field(min_length=7, max_length=20)
    email: EmailStr | None = None
    is_active: bool = True


class ClinicUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    name: str | None = Field(default=None, min_length=2, max_length=150)
    address: str | None = Field(default=None, min_length=1)
    city: str | None = Field(default=None, min_length=2, max_length=100)
    state: str | None = Field(default=None, min_length=2, max_length=100)
    pincode: str | None = Field(default=None, min_length=1, max_length=10)
    phone: str | None = Field(default=None, min_length=7, max_length=20)
    email: EmailStr | None = None
    is_active: bool | None = None


class ClinicFilterParams(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

    city: str | None = Field(default=None, min_length=1, max_length=100)
    state: str | None = Field(default=None, min_length=1, max_length=100)
    pincode: str | None = Field(default=None, min_length=1, max_length=10)
    is_active: bool | None = None
    search: str | None = Field(default=None, min_length=1, max_length=150)


class ClinicResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    address: str
    city: str
    state: str
    pincode: str
    phone: str
    email: str | None
    is_active: bool
    created_at: datetime
