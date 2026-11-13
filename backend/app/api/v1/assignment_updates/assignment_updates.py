from typing import Annotated

from fastapi import APIRouter, Depends, Query, status

from app.core import UserRole
from app.dependencies import (
    get_volunteer_service,
    get_work_assignment_update_service,
    require_roles,
)
from app.models import User
from app.schemas import (
    AssignmentUpdateCreate,
    AssignmentUpdateFilterParams,
    AssignmentUpdatePatch,
    AssignmentUpdateResponse,
    ClinicAdmissionCreate,
)
from app.services.protocol import (
    VolunteerServiceProtocol,
    WorkAssignmentUpdateServiceProtocol,
)

router = APIRouter(prefix="/assignment-updates", tags=["Assignment updates"])


@router.get("/", response_model=list[AssignmentUpdateResponse])
async def get_all_updates(
    user: Annotated[User, Depends(require_roles(UserRole.ADMIN))],
    service: Annotated[
        WorkAssignmentUpdateServiceProtocol,
        Depends(get_work_assignment_update_service),
    ],
    filters: Annotated[AssignmentUpdateFilterParams, Depends()],
    limit: int = Query(default=20, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
):
    return await service.get_all_updates(filters, limit, offset)


@router.get("/{update_id}", response_model=AssignmentUpdateResponse)
async def get_update_by_id(
    update_id: int,
    user: Annotated[User, Depends(require_roles(UserRole.ADMIN, UserRole.VOLUNTEER))],
    service: Annotated[
        WorkAssignmentUpdateServiceProtocol,
        Depends(get_work_assignment_update_service),
    ],
    volunteer_service: Annotated[
        VolunteerServiceProtocol, Depends(get_volunteer_service)
    ],
):
    if user.role == UserRole.VOLUNTEER:
        await volunteer_service.require_approved_volunteer(user.id)
    return await service.get_update_by_id(update_id)


@router.post("/", response_model=AssignmentUpdateResponse)
async def updates_assignment(
    data: AssignmentUpdateCreate,
    user: Annotated[User, Depends(require_roles(UserRole.ADMIN, UserRole.VOLUNTEER))],
    service: Annotated[
        WorkAssignmentUpdateServiceProtocol,
        Depends(get_work_assignment_update_service),
    ],
    volunteer_service: Annotated[
        VolunteerServiceProtocol, Depends(get_volunteer_service)
    ],
):
    if user.role == UserRole.VOLUNTEER:
        await volunteer_service.require_approved_volunteer(user.id)
    return await service.create_update(data, user)


@router.patch("/{update_id}", response_model=AssignmentUpdateResponse)
async def update_assignment_update(
    update_id: int,
    data: AssignmentUpdatePatch,
    user: Annotated[User, Depends(require_roles(UserRole.ADMIN, UserRole.VOLUNTEER))],
    service: Annotated[
        WorkAssignmentUpdateServiceProtocol,
        Depends(get_work_assignment_update_service),
    ],
    volunteer_service: Annotated[
        VolunteerServiceProtocol, Depends(get_volunteer_service)
    ],
):
    if user.role == UserRole.VOLUNTEER:
        await volunteer_service.require_approved_volunteer(user.id)
    return await service.update_update(update_id, data, user)


@router.delete("/{update_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_assignment_update(
    update_id: int,
    user: Annotated[User, Depends(require_roles(UserRole.ADMIN, UserRole.VOLUNTEER))],
    service: Annotated[
        WorkAssignmentUpdateServiceProtocol,
        Depends(get_work_assignment_update_service),
    ],
    volunteer_service: Annotated[
        VolunteerServiceProtocol, Depends(get_volunteer_service)
    ],
):
    if user.role == UserRole.VOLUNTEER:
        await volunteer_service.require_approved_volunteer(user.id)
    await service.delete_update(update_id, user)


@router.post("/{assignment_id}/clinic_admission", status_code=status.HTTP_201_CREATED)
async def create_clinic_admission(
    assignment_id: int,
    data: ClinicAdmissionCreate,
    user: Annotated[User, Depends(require_roles(UserRole.VOLUNTEER, UserRole.ADMIN))],
    service: Annotated[
        WorkAssignmentUpdateServiceProtocol, Depends(get_work_assignment_update_service)
    ],
    volunteer_service: Annotated[
        VolunteerServiceProtocol, Depends(get_volunteer_service)
    ],
):
    if user.role == UserRole.VOLUNTEER:
        await volunteer_service.require_approved_volunteer(user.id)
    return await service.create_clinic_admission(assignment_id, data, user)
