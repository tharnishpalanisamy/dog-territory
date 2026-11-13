from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, model_validator

from app.core import AssignmentUpdateType


class AssignmentUpdateCreate(BaseModel):
    assignment_id: int = Field(gt=0)
    update_type: AssignmentUpdateType
    description: str = Field(min_length=1, max_length=2000)


class AssignmentUpdatePatch(BaseModel):
    update_type: AssignmentUpdateType | None = None
    description: str | None = Field(default=None, min_length=1, max_length=2000)


class AssignmentUpdateFilterParams(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

    assignment_id: int | None = Field(default=None, gt=0)
    updated_by: int | None = Field(default=None, gt=0)
    update_type: AssignmentUpdateType | None = None
    state: str | None = Field(default=None, min_length=2, max_length=100)
    district: str | None = Field(default=None, min_length=2, max_length=100)
    area_name: str | None = Field(default=None, min_length=1, max_length=100)
    pincode: str | None = Field(default=None, min_length=1, max_length=10)
    created_from: datetime | None = None
    created_to: datetime | None = None
    search: str | None = Field(default=None, min_length=1, max_length=2000)

    @model_validator(mode="after")
    def validate_date_range(self):
        if (
            self.created_from
            and self.created_to
            and self.created_from > self.created_to
        ):
            raise ValueError("created_from cannot be later than created_to")
        return self


class AssignmentUpdateResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    assignment_id: int
    updated_by: int
    update_type: AssignmentUpdateType
    description: str
    created_at: datetime



class ClinicAdmissionCreate(BaseModel):
    clinic_id: int 
    dog_id: int | None = None
    admission_notes: str | None = None