from typing import Annotated

from app.core import UserRole
from app.dependencies import get_work_assignment_service, require_roles
from app.models import User
from app.schemas import (
    AssignAssignment,
    AssignmentUpdateCreate,
    AvailableAssignmentFilterParams,
    UpdateAssignmentStatus,
    WorkAssignmentCreate,
    WorkAssignmentDetailResponse,
    WorkAssignmentFilterParams,
    WorkAssignmentResponse,
    WorkAssignmentSummaryResponse,
    WorkAssignmentUpdate,
)
from app.services.protocol import WorkAssignmentServiceProtocol
from fastapi import APIRouter, Depends, Query, status

router = APIRouter(prefix="/assignments", tags=["assignment"])


@router.post(
    "/", status_code=status.HTTP_201_CREATED, response_model=WorkAssignmentResponse
)
async def create_assignment(
    assignment_data: WorkAssignmentCreate,
    user: Annotated[User, Depends(require_roles(UserRole.ADMIN))],
    service: Annotated[
        WorkAssignmentServiceProtocol, Depends(get_work_assignment_service)
    ],
):
    return await service.create_work_assignment(user, assignment_data)


@router.get("/", response_model=list[WorkAssignmentSummaryResponse])
async def get_all_assignments(
    user: Annotated[User, Depends(require_roles(UserRole.ADMIN, UserRole.VOLUNTEER))],
    service: Annotated[
        WorkAssignmentServiceProtocol, Depends(get_work_assignment_service)
    ],
    filters: Annotated[WorkAssignmentFilterParams, Depends()],
    limit: int = Query(ge=1, default=20, le=100),
    offset: int = Query(ge=0, default=0),
):
    return await service.get_all_assignments(filters, limit, offset)


@router.get("/available", response_model=list[WorkAssignmentSummaryResponse])
async def get_available_assignments(
    user: Annotated[User, Depends(require_roles(UserRole.ADMIN, UserRole.VOLUNTEER))],
    service: Annotated[
        WorkAssignmentServiceProtocol, Depends(get_work_assignment_service)
    ],
    filters: Annotated[AvailableAssignmentFilterParams, Depends()],
    limit: int = Query(ge=1, default=20, le=100),
    offset: int = Query(ge=0, default=0),
):
    return await service.get_available_work_assignments(filters, limit, offset)


@router.get("/assigned", response_model=list[WorkAssignmentSummaryResponse])
async def get_current_user_assignments(
    user: Annotated[
        User, Depends(require_roles(UserRole.VOLUNTEER, UserRole.VETERINARIAN))
    ],
    service: Annotated[
        WorkAssignmentServiceProtocol, Depends(get_work_assignment_service)
    ],
):
    return await service.get_assigned_assignments(user)


@router.get("/{assignment_id}", response_model=WorkAssignmentDetailResponse)
async def get_assignment_by_id(
    assignment_id: int,
    user: Annotated[User, Depends(require_roles(UserRole.VOLUNTEER, UserRole.ADMIN))],
    service: Annotated[
        WorkAssignmentServiceProtocol, Depends(get_work_assignment_service)
    ],
):
    return await service.get_assignment_by_id(assignment_id)


@router.patch("/{assignment_id}/claim")
async def claim_assignment(
    assignment_id: int,
    user: Annotated[User, Depends(require_roles(UserRole.VOLUNTEER, UserRole.ADMIN))],
    service: Annotated[
        WorkAssignmentServiceProtocol, Depends(get_work_assignment_service)
    ],
):
    return await service.claim_assignment(assignment_id, user)


@router.patch("/{assignment_id}/assign")
async def assign_assignment(
    assignment_id: int,
    data: AssignAssignment,
    user: Annotated[User, Depends(require_roles(UserRole.ADMIN))],
    service: Annotated[
        WorkAssignmentServiceProtocol, Depends(get_work_assignment_service)
    ],
):
    return await service.update_assigned_to(assignment_id, data, user)


@router.patch("/{assignment_id}/status")
async def status_assignment(
    assignment_id: int,
    data: UpdateAssignmentStatus,
    user: Annotated[User, Depends(require_roles(UserRole.ADMIN, UserRole.VOLUNTEER))],
    service: Annotated[
        WorkAssignmentServiceProtocol, Depends(get_work_assignment_service)
    ],
):
    return await service.update_status(assignment_id, data, user)


@router.post("/{assignment_id}/updates")
async def updates_assignment(
    assignment_id: int,
    data: AssignmentUpdateCreate,
    user: Annotated[User, Depends(require_roles(UserRole.ADMIN, UserRole.VOLUNTEER))],
    service: Annotated[
        WorkAssignmentServiceProtocol, Depends(get_work_assignment_service)
    ],
):
    return await service.create_update(assignment_id, data, user) 


@router.patch("/{assignment_id}", response_model=WorkAssignmentResponse)
async def update_assignment(
    assignment_id: int,
    assignment_data: WorkAssignmentUpdate,
    user: Annotated[User, Depends(require_roles(UserRole.ADMIN))],
    service: Annotated[
        WorkAssignmentServiceProtocol, Depends(get_work_assignment_service)
    ],
):
    return await service.update_work_assignment(assignment_id, assignment_data)


@router.delete("/{assignment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_assignment(
    assignment_id: int,
    user: Annotated[User, Depends(require_roles(UserRole.ADMIN))],
    service: Annotated[
        WorkAssignmentServiceProtocol, Depends(get_work_assignment_service)
    ],
):
    await service.delete_work_assignment(assignment_id)
