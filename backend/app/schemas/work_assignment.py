from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, model_validator

from app.core import (
    AssignmentPriority,
    AssignmentStatus,
    AssignmentType,
)
from app.schemas.dog import DogSummaryResponse


class WorkAssignmentCreate(BaseModel):
    report_id: int
    title: str = Field(min_length=3, max_length=150)
    description: str | None = None
    task_type: AssignmentType
    priority: AssignmentPriority = AssignmentPriority.NORMAL
    assigned_to: int | None = None


class WorkAssignmentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    report_id: int

    title: str
    description: str | None

    task_type: AssignmentType
    priority: AssignmentPriority
    status: AssignmentStatus

    assigned_to: int | None
    assigned_by: int | None

    created_at: datetime
    accepted_at: datetime | None
    completed_at: datetime | None


class WorkAssignmentSummaryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    report_id: int

    title: str
    task_type: AssignmentType
    priority: AssignmentPriority
    status: AssignmentStatus

    assigned_to: int | None
    created_at: datetime


class WorkAssignmentFilterParams(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

    # Assignment filters
    report_id: int | None = Field(default=None, gt=0)
    task_type: AssignmentType | None = None
    priority: AssignmentPriority | None = None
    status: AssignmentStatus | None = None

    # Assignment ownership (primarily for admins)
    assigned_to: int | None = Field(default=None, gt=0)
    assigned_by: int | None = Field(default=None, gt=0)

    # Geographical filters (from associated report)
    state: str | None = Field(default=None, min_length=2, max_length=100)
    district: str | None = Field(default=None, min_length=2, max_length=100)
    pincode: str | None = Field(default=None, min_length=6, max_length=6)
    area_name: str | None = Field(default=None, min_length=1, max_length=20)

    # Date filters
    created_from: datetime | None = None
    created_to: datetime | None = None

    # Search
    search: str | None = Field(default=None, min_length=1, max_length=100)

    @model_validator(mode="after")
    def validate_date_range(self):
        if (
            self.created_from
            and self.created_to
            and self.created_from > self.created_to
        ):
            raise ValueError("created_from cannot be later than created_to")

        return self


class AssignmentReportResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    report_type: str
    description: str | None
    pincode: str
    location: str
    dog: DogSummaryResponse | None


class WorkAssignmentDetailResponse(WorkAssignmentResponse):
    report: AssignmentReportResponse


from pydantic import BaseModel, ConfigDict


class AvailableAssignmentFilterParams(BaseModel):
    model_config = ConfigDict(extra="ignore")
    state: str | None = None
    district: str | None = None
    area_name: str | None = None
    priority: AssignmentPriority | None = None
    task_type: AssignmentType | None = None
    search: str | None = None
