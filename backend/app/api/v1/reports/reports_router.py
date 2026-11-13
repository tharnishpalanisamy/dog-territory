from typing import Annotated

from fastapi import APIRouter, Depends, File, Form, Query, UploadFile, status

from app.core import DogReportType, UserRole
from app.dependencies import (
    get_current_user,
    get_reports_service,
    get_volunteer_service,
    require_roles,
)
from app.models import User
from app.schemas import (
    ReportCreate,
    ReportFilterParams,
    ReportResponse,
    ReportStatusUpdate,
    ReportSummaryResponse,
    ReportUpdate,
)
from app.services.protocol import ReportsServiceProtocol, VolunteerServiceProtocol

router = APIRouter(prefix="/reports", tags=["Reports"])


@router.post(
    "/create", response_model=ReportSummaryResponse, status_code=status.HTTP_201_CREATED
)
async def create_report(
    report_type: Annotated[DogReportType, Form()],
    user: Annotated[User, Depends(get_current_user)],
    service: Annotated[ReportsServiceProtocol, Depends(get_reports_service)],
    description: str = Form(...),
    state: str = Form(...),
    district: str = Form(...),
    area_name: str = Form(...),
    pincode: str = Form(...),
    location: str = Form(...),
    dog_code: Annotated[str | None, Form()] = None,
    image: Annotated[UploadFile | None, File()] = None,
):

    data = ReportCreate(
        report_type=report_type,
        description=description,
        state=state,
        district=district,
        area_name=area_name,
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
    volunteer_service: Annotated[
        VolunteerServiceProtocol, Depends(get_volunteer_service)
    ],
    limit: int = Query(ge=1, le=100, default=20),
    offset: int = Query(ge=0, default=0),
):
    if user.role == UserRole.VOLUNTEER:
        await volunteer_service.require_approved_volunteer(user.id)
    return await service.get_all_reports(filters, limit, offset)


@router.get("/me", response_model=list[ReportResponse])
async def get_current_user_reports(
    user: Annotated[User, Depends(get_current_user)],
    service: Annotated[ReportsServiceProtocol, Depends(get_reports_service)],
):
    return await service.get_current_user_reports(user)


@router.get("/{report_id}", response_model=ReportSummaryResponse)
async def get_report_by_id(
    report_id: int,
    user: Annotated[User, Depends(require_roles(UserRole.VOLUNTEER, UserRole.ADMIN))],
    service: Annotated[ReportsServiceProtocol, Depends(get_reports_service)],
    volunteer_service: Annotated[
        VolunteerServiceProtocol, Depends(get_volunteer_service)
    ],
):
    if user.role == UserRole.VOLUNTEER:
        await volunteer_service.require_approved_volunteer(user.id)
    return await service.get_report_by_id(report_id)


@router.patch("/{report_id}/status", response_model=ReportResponse)
async def update_report_status(
    report_id: int,
    report_data: ReportStatusUpdate,
    user: Annotated[User, Depends(require_roles(UserRole.ADMIN))],
    service: Annotated[ReportsServiceProtocol, Depends(get_reports_service)],
):
    return await service.update_status_by_report_id(report_id, report_data)


@router.patch("/{report_id}", response_model=ReportResponse)
async def update_report(
    report_id: int,
    report_data: ReportUpdate,
    user: Annotated[User, Depends(get_current_user)],
    service: Annotated[ReportsServiceProtocol, Depends(get_reports_service)],
):
    return await service.update_report(user, report_id, report_data)


@router.delete("/{report_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_report(
    report_id: int,
    user: Annotated[User, Depends(get_current_user)],
    service: Annotated[ReportsServiceProtocol, Depends(get_reports_service)],
):
    await service.delete_report(user, report_id)
