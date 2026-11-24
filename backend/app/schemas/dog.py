from datetime import datetime
from decimal import Decimal
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, model_validator


class DogCreate(BaseModel):
    state: str = Field(min_length=1, max_length=50)
    district: str = Field(min_length=1, max_length=50)
    area_name: str = Field(min_length=1, max_length=100)
    pin_code: str = Field(pattern=r"^[1-9][0-9]{5}$")

    estimated_age: int | None = Field(default=None, ge=0, le=30)
    color: str | None = Field(default=None, max_length=50)
    description: str | None = Field(default=None, max_length=255)

    is_sterilized: bool | None = None

    latitude: Decimal = Field(ge=-90, le=90)
    longitude: Decimal = Field(ge=-180, le=180)

    vaccination_status: str = Field(max_length=20)
    vaccination_date: datetime | None = None
    booster_dose_date: datetime | None = None


class DogUpdate(BaseModel):
    state: str | None = Field(default=None, min_length=1, max_length=50)
    district: str | None = Field(default=None, min_length=1, max_length=50)
    area_name: str | None = Field(default=None, min_length=1, max_length=100)
    estimated_age: int | None = Field(default=None, ge=0, le=30)
    color: str | None = Field(default=None, max_length=50)
    description: str | None = Field(default=None, max_length=255)
    is_sterilized: bool | None = None
    status: str | None = Field(default=None, min_length=1, max_length=20)
    latitude: Decimal | None = Field(default=None, ge=-90, le=90)
    longitude: Decimal | None = Field(default=None, ge=-180, le=180)
    vaccination_status: str | None = Field(default=None, min_length=1, max_length=20)
    vaccination_date: datetime | None = None
    next_booster_due_date: datetime | None = None

    @model_validator(mode="after")
    def require_at_least_one_field(self) -> "DogUpdate":
        if not self.model_fields_set:
            raise ValueError("At least one field must be provided")
        return self


class DogResponse(BaseModel):
    id: int
    dog_code: str
    status: str
    vaccination_status: str
    vaccination_date: datetime | None


class DogSummaryResponse(BaseModel):
    id: int
    dog_code: str
    estimated_age: int | None
    color: str | None
    status: str
    vaccination_status: str
    is_sterilized: bool | None
    area_name: str
    image_url: str | None = None

    model_config = ConfigDict(from_attributes=True)


class DogImageResponse(BaseModel):
    id: int
    image_url: str | None
    is_primary: bool

    model_config = ConfigDict(from_attributes=True)


class DogDetailResponse(BaseModel):
    # Keep all your existing fields
    id: int
    dog_code: str
    estimated_age: int | None
    color: str | None
    description: str | None
    is_sterilized: bool | None
    status: str
    vaccination_status: str
    vaccination_date: datetime | None
    next_booster_due_date: datetime | None
    state: str | None
    district: str | None
    area_name: str | None
    pincode: str | None
    created_at: datetime
    updated_at: datetime

    images: list[DogImageResponse] = []

    model_config = ConfigDict(from_attributes=True)


class DogFilterParams(BaseModel):
    model_config = ConfigDict(
        extra="forbid",
        str_strip_whitespace=True,
    )

    # Filters
    status: str | None = Field(default=None, min_length=1, max_length=20)
    is_sterilized: bool | None = None
    vaccination_status: str | None = Field(default=None, min_length=1, max_length=20)

    # Location
    state: str | None = Field(default=None, min_length=1, max_length=50)
    district: str | None = Field(default=None, min_length=1, max_length=50)
    area_name: str | None = Field(default=None, min_length=1, max_length=100)
    pincode: str | None = Field(default=None, pattern=r"^[1-9][0-9]{5}$")

    # Age range
    estimated_age_min: int | None = Field(default=None, ge=0, le=30)
    estimated_age_max: int | None = Field(default=None, ge=0, le=30)

    # Sorting
    sort_by: Literal[
        "created_at",
        "updated_at",
        "estimated_age",
        "dog_number",
        "vaccination_date",
    ] = "created_at"

    order: Literal["asc", "desc"] = "desc"

    # Pagination
    offset: int = Field(default=0, ge=0)
    limit: int = Field(default=20, ge=1, le=100)

    @model_validator(mode="after")
    def validate_age_range(self) -> "DogFilterParams":
        if (
            self.estimated_age_min is not None
            and self.estimated_age_max is not None
            and self.estimated_age_min > self.estimated_age_max
        ):
            raise ValueError(
                "estimated_age_min cannot be greater than estimated_age_max"
            )

        return self
