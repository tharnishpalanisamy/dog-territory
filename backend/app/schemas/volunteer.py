from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.core import VolunteerAvailability


class VolunteerCreate(BaseModel):
    phone_number: str = Field(min_length=10, max_length=20)

    state: str = Field(min_length=2, max_length=100)
    district: str = Field(min_length=2, max_length=100)

    area_name: str = Field(min_length=2, max_length=150)
    pincode: str = Field(pattern=r"^\d{6}$")

    availability: VolunteerAvailability = VolunteerAvailability.WEEKENDS

    service_pincodes: list[str] = Field(default_factory=list, max_length=20)

    @field_validator("service_pincodes")
    @classmethod
    def validate_service_pincodes(cls, pincodes: list[str]) -> list[str]:
        if any(not pincode.isdigit() or len(pincode) != 6 for pincode in pincodes):
            raise ValueError("Service pincodes must each contain exactly 6 digits")
        return list(dict.fromkeys(pincodes))


class VolunteerUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    phone_number: str = Field(default="", min_length=10, max_length=20)
    state: str = Field(default="", min_length=2, max_length=100)
    district: str = Field(default="", min_length=2, max_length=100)
    area_name: str = Field(default="", min_length=2, max_length=150)
    pincode: str = Field(default="", pattern=r"^\d{6}$")
    availability: VolunteerAvailability = VolunteerAvailability.WEEKENDS
    service_pincodes: list[str] = Field(default_factory=list, max_length=20)

    @field_validator("service_pincodes")
    @classmethod
    def validate_service_pincodes(cls, pincodes: list[str]) -> list[str]:
        if any(not pincode.isdigit() or len(pincode) != 6 for pincode in pincodes):
            raise ValueError("Service pincodes must each contain exactly 6 digits")
        return list(dict.fromkeys(pincodes))


class VolunteerApprovalUpdate(BaseModel):
    is_approved: bool


class VolunteerResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    phone_number: str
    state: str
    district: str
    area_name: str
    pincode: str
    availability: VolunteerAvailability
    service_pincodes: list[str]
    approval_status: str
