from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, Field


class DogCreate(BaseModel):
    estimated_age: int | None = Field(default=None, ge=0, le=30)
    color: str | None = Field(default=None, max_length=50)
    description: str | None = Field(default=None, max_length=255)

    is_sterilized: bool | None = None

    state: str = Field(min_length=1, max_length=50)
    district: str = Field(min_length=1, max_length=50)
    area_name: str = Field(min_length=1, max_length=100)
    pin_code: str = Field(pattern=r"^[1-9][0-9]{5}$")

    latitude: Decimal = Field(ge=-90, le=90)
    longitude: Decimal = Field(ge=-180, le=180)

    vaccination_status: str = Field(max_length=20)
    vaccination_date: datetime | None = None
    booster_dose_date: datetime | None = None
