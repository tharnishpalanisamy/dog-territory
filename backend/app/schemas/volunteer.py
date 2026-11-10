from pydantic import BaseModel, ConfigDict, Field

from app.core import VolunteerAvailability


class VolunteerCreate(BaseModel):
    phone_number: str = Field(min_length=10, max_length=20)

    state: str = Field(min_length=2, max_length=100)
    district: str = Field(min_length=2, max_length=100)

    area_name: str = Field(min_length=2, max_length=150)
    pincode: str = Field(min_length=4, max_length=10)

    availability: VolunteerAvailability = VolunteerAvailability.WEEKENDS

    service_pincodes: list[str] = Field(default_factory=list)


class VolunteerUpdate(BaseModel):
    phone_number: str | None = Field(default=None, min_length=10, max_length=20)
    state: str | None = Field(default=None, min_length=2, max_length=100)
    district: str | None = Field(default=None, min_length=2, max_length=100)
    areas: list[str] | None = None


class VolunteerApprovalUpdate(BaseModel):
    is_approved: bool


class VolunteerResponse(BaseModel):
    id: int
    user_id: int
    phone_number: str
    state: str
    district: str
    areas: list[str]
    is_approved: bool

    model_config = ConfigDict(from_attributes=True)
