from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator

from app.core import VeterinarianApprovalStatus


class VeterinarianCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    clinic_id: int = Field(gt=0)
    full_name: str = Field(min_length=2, max_length=150)
    phone: str = Field(min_length=7, max_length=20)
    qualification: str = Field(min_length=2, max_length=150)
    license_number: str = Field(min_length=2, max_length=100)
    specialization: str | None = Field(default=None, max_length=150)
    years_of_experience: int | None = Field(default=None, ge=0)


class VeterinarianUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    clinic_id: int | None = Field(default=None, gt=0)
    full_name: str | None = Field(default=None, min_length=2, max_length=150)
    phone: str | None = Field(default=None, min_length=7, max_length=20)
    qualification: str | None = Field(default=None, min_length=2, max_length=150)
    license_number: str | None = Field(default=None, min_length=2, max_length=100)
    specialization: str | None = Field(default=None, max_length=150)
    years_of_experience: int | None = Field(default=None, ge=0)

    @model_validator(mode="before")
    @classmethod
    def reject_null_for_required_fields(cls, value):
        if isinstance(value, dict):
            nullable_fields = {"specialization", "years_of_experience"}
            for field, field_value in value.items():
                if field not in nullable_fields and field_value is None:
                    raise ValueError(f"{field} cannot be null")
        return value


class VeterinarianApprovalUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    approval_status: VeterinarianApprovalStatus
    rejection_reason: str | None = Field(default=None, max_length=5000)

    @field_validator("approval_status")
    @classmethod
    def only_approve_or_reject(
        cls, value: VeterinarianApprovalStatus
    ) -> VeterinarianApprovalStatus:
        if value not in (
            VeterinarianApprovalStatus.APPROVED,
            VeterinarianApprovalStatus.REJECTED,
        ):
            raise ValueError("approval_status must be approved or rejected")
        return value


class VeterinarianFilterParams(BaseModel):
    approval_status: VeterinarianApprovalStatus | None = None
    clinic_id: int | None = Field(default=None, gt=0)


class VeterinarianResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    clinic_id: int
    full_name: str
    phone: str
    qualification: str
    license_number: str
    specialization: str | None
    years_of_experience: int | None
    license_document_path: str | None
    approval_status: VeterinarianApprovalStatus
    reviewed_by: int | None
    reviewed_at: datetime | None
    rejection_reason: str | None
    created_at: datetime
