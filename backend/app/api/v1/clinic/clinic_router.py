from typing import Annotated

from fastapi import APIRouter, Depends, Query, status

from app.core import UserRole
from app.dependencies import get_clinic_service, require_roles
from app.models import User
from app.schemas import (
    ClinicCreate,
    ClinicFilterParams,
    ClinicResponse,
    ClinicUpdate,
)
from app.services.protocol import ClinicServiceProtocol

router = APIRouter(prefix="/clinics", tags=["Clinics"])


@router.post(
    "/",
    response_model=ClinicResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_clinic(
    data: ClinicCreate,
    user: Annotated[User, Depends(require_roles(UserRole.ADMIN))],
    service: Annotated[ClinicServiceProtocol, Depends(get_clinic_service)],
):
    return await service.create(data)


@router.get("/", response_model=list[ClinicResponse])
async def get_all_clinics(
    user: Annotated[User, Depends(require_roles(UserRole.ADMIN))],
    service: Annotated[ClinicServiceProtocol, Depends(get_clinic_service)],
    filters: Annotated[ClinicFilterParams, Depends()],
    limit: int = Query(default=20, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
):
    return await service.get_all(filters, limit, offset)


@router.get("/{clinic_id}", response_model=ClinicResponse)
async def get_clinic_by_id(
    clinic_id: int,
    user: Annotated[User, Depends(require_roles(UserRole.ADMIN))],
    service: Annotated[ClinicServiceProtocol, Depends(get_clinic_service)],
):
    return await service.get_by_id(clinic_id)


@router.patch("/{clinic_id}", response_model=ClinicResponse)
async def update_clinic(
    clinic_id: int,
    data: ClinicUpdate,
    user: Annotated[User, Depends(require_roles(UserRole.ADMIN))],
    service: Annotated[ClinicServiceProtocol, Depends(get_clinic_service)],
):
    return await service.update(clinic_id, data)


@router.delete("/{clinic_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_clinic(
    clinic_id: int,
    user: Annotated[User, Depends(require_roles(UserRole.ADMIN))],
    service: Annotated[ClinicServiceProtocol, Depends(get_clinic_service)],
):
    await service.delete(clinic_id)
