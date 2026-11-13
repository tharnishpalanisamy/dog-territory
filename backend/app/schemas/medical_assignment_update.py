from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.core import MedicalAssignmentUpdateType


class MedicalAssignmentUpdateCreate(BaseModel):
    update_type: MedicalAssignmentUpdateType
    description: str = Field(min_length=1, max_length=2000)


class MedicalAssignmentUpdatePatch(BaseModel):
    model_config = ConfigDict(extra="forbid")

    update_type: MedicalAssignmentUpdateType | None = None
    description: str | None = Field(default=None, min_length=1, max_length=2000)


class MedicalAssignmentUpdateResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    medical_assignment_id: int
    updated_by: int
    update_type: MedicalAssignmentUpdateType
    description: str
    created_at: datetime
