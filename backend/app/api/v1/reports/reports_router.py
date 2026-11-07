from typing import Annotated

from app.core import DogReportType, UserRole
from app.dependencies import get_current_user, get_reports_service, require_roles
from app.models import User
from app.schemas import (
    ReportCreate,
    ReportFilterParams,
    ReportResponse,
    ReportSummaryResponse,
)
from app.services.protocol import ReportsServiceProtocol
from fastapi import APIRouter, Depends, File, Form, Query, UploadFile, status

router = APIRouter(prefix="/reports", tags=["Reports"])


@router.post(
    "/create", response_model=ReportSummaryResponse, status_code=status.HTTP_201_CREATED
)
async def create_report(
    report_type: Annotated[DogReportType, Form()],
    user: Annotated[User, Depends(get_current_user)],
    service: Annotated[ReportsServiceProtocol, Depends(get_reports_service)],
    description: str = Form(...),
    pincode: str = Form(...),
    location: str = Form(...),
    dog_code: Annotated[str | None, Form()] = None,
    image: Annotated[UploadFile | None, File()] = None,
):

    data = ReportCreate(
        report_type=report_type,
        description=description,
        pincode=pincode,
        location=location,
        dog_code=dog_code,
    )

    return await service.create_report(user, data, image)


@router.get("/", response_model=list[ReportResponse])
async def get_all_reports(
    user: Annotated[User, Depends(require_roles(UserRole.VOLUNTEER, UserRole.ADMIN))],
    service: Annotated[ReportsServiceProtocol, Depends(get_reports_service)],
    filters: Annotated[ReportFilterParams, Depends()],
    limit: int = Query(ge=1, le=100, default=20),
    offset: int = Query(ge=0, default=0),
):

    return await service.get_all_reports(filters, limit, offset)


@router.get("/me", response_model=list[ReportResponse])
async def get_current_user_reports(
    user: Annotated[User, Depends(get_current_user)],
    service: Annotated[ReportsServiceProtocol, Depends(get_reports_service)],
):
    return await service.get_current_user_reports(user)


@router.get("/assigned", response_model=list[ReportResponse])
async def get_assigned_reports(
    user: Annotated[User, Depends(get_current_user)],
    service: Annotated[
        ReportsServiceProtocol, Depends(require_roles(UserRole.VETERINARIAN))
    ],
):
    return await service.get_assigned_reports(user)


@router.get("/{report_id}", response_model=ReportSummaryResponse)
async def get_report_by_id(
    report_id: int,
    user: Annotated[User, Depends(require_roles(UserRole.VOLUNTEER, UserRole.ADMIN))],
    service: Annotated[ReportsServiceProtocol, Depends(get_reports_service)],
):
    return await service.get_report_by_id(report_id)
