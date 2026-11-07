from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.core import DogReportType, ReportStatus


class ReportCreate(BaseModel):
    report_type: DogReportType
    description: str | None = None
    pincode: str
    location: str
    dog_code: str | None = None


class ReportResponse(BaseModel):
    id: int
    reporter_id: int
    dog_id: int | None
    report_type: DogReportType
    description: str | None
    pincode: str
    location: str
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
    location: str
    status: ReportStatus
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


class ReportFilterParams(BaseModel):
    report_type: DogReportType | None = None 
    status: ReportStatus | None = None
    pincode: str | None = Field(min_length=6, max_length=6, default=None)
