from datetime import datetime

import re

from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.core import DogReportType, ReportStatus


class ReportCreate(BaseModel):
    report_type: DogReportType
    description: str | None = None
    state: str
    district: str
    area_name: str
    pincode: str
    landmark: str
    dog_code: str | None = None
    phone_number: str | None = Field(default=None, max_length=20)

    @field_validator("phone_number")
    @classmethod
    def validate_phone_number(cls, value: str | None) -> str | None:
        if value is None:
            return value
        normalized = re.sub(r"[\s()-]", "", value)
        if not re.fullmatch(r"(?:\+91)?[6-9]\d{9}", normalized):
            raise ValueError("Enter a valid Indian phone number")
        return normalized if normalized.startswith("+91") else f"+91{normalized}"


class ReportUpdate(BaseModel):
    report_type: DogReportType | None = None
    description: str | None = None
    state: str | None = None
    district: str | None = None
    area_name: str | None = None
    pincode: str | None = None
    landmark: str | None = None
    dog_code: str | None = None


class ReportResponse(BaseModel):
    id: int
    reporter_id: int
    dog_id: int | None
    report_type: DogReportType
    description: str | None
    pincode: str
    landmark: str
    image_filename: str | None
    status: ReportStatus
    created_at: datetime
    updated_at: datetime | None

    model_config = ConfigDict(from_attributes=True)


class ReportSummaryResponse(BaseModel):
    id: int
    report_type: DogReportType
    description: str | None
    pincode: str
    landmark: str
    status: ReportStatus
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


class ReportFilterParams(BaseModel):
    report_type: DogReportType | None = None
    status: ReportStatus | None = None
    pincode: str | None = Field(min_length=6, max_length=6, default=None)


class ReportStatusUpdate(BaseModel):
    status: ReportStatus
