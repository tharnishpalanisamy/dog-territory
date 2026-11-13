from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.core import MedicalAssignmentMode, MedicalAssignmentStatus


class MedicalAssignmentCreate(BaseModel):
    dog_id: int | None = Field(default=None, gt=0)
    work_assignment_id: int | None = Field(default=None, gt=0)
    clinic_id: int = Field(gt=0)
    title: str = Field(min_length=1, max_length=150)
    description: str = Field(min_length=1)
    mode: MedicalAssignmentMode = MedicalAssignmentMode.CLINIC


class MedicalAssignmentFilterParams(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

    dog_id: int | None = Field(default=None, gt=0)
    work_assignment_id: int | None = Field(default=None, gt=0)
    clinic_id: int | None = Field(default=None, gt=0)
    created_by: int | None = Field(default=None, gt=0)
    volunteer_id: int | None = Field(default=None, gt=0)
    veterinarian_id: int | None = Field(default=None, gt=0)
    mode: MedicalAssignmentMode | None = None
    status: MedicalAssignmentStatus | None = None
    search: str | None = Field(default=None, min_length=1, max_length=200)


class MedicalAssignmentReassign(BaseModel):
    veterinarian_id: int = Field(gt=0)


class MedicalAssignmentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    dog_id: int | None
    work_assignment_id: int | None
    clinic_id: int
    created_by: int
    volunteer_id: int | None
    veterinarian_id: int | None
    title: str
    description: str
    mode: MedicalAssignmentMode
    status: MedicalAssignmentStatus
    created_at: datetime
    claimed_at: datetime | None
    completed_at: datetime | None
