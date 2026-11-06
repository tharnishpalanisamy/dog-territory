from datetime import datetime
from decimal import Decimal

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

    model_config = ConfigDict(from_attributes=True)


class DogDetailResponse(BaseModel):
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

    state: str
    district: str
    area_name: str
    pincode: str

    created_at: datetime
    updated_at: datetime | None

    model_config = ConfigDict(from_attributes=True)


class DogFilterParams(BaseModel):
    model_config = ConfigDict(
        extra="forbid",
        str_strip_whitespace=True,
    )

    status: str | None = Field(default=None, min_length=1, max_length=20)
    is_sterilized: bool | None = None
    vaccination_status: str | None = Field(default=None, min_length=1, max_length=20)

    state: str | None = Field(default=None, min_length=1, max_length=50)
    district: str | None = Field(default=None, min_length=1, max_length=50)
    area_name: str | None = Field(default=None, min_length=1, max_length=100)
    pincode: str | None = Field(default=None, pattern=r"^[1-9][0-9]{5}$")

    estimated_age_min: int | None = Field(default=None, ge=0, le=30)
    estimated_age_max: int | None = Field(default=None, ge=0, le=30)

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
