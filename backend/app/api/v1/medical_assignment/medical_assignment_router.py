from typing import Annotated

from fastapi import APIRouter, Depends, Query, status

from app.core import UserRole
from app.dependencies import (
    get_medical_assignment_service,
    get_volunteer_service,
    require_roles,
)
from app.models import User
from app.schemas import (
    MedicalAssignmentCreate,
    MedicalAssignmentFilterParams,
    MedicalAssignmentReassign,
    MedicalAssignmentResponse,
)
from app.services.protocol import MedicalAssignmentServiceProtocol, VolunteerServiceProtocol

medical_assignment_router = APIRouter(
    prefix="/medical-assignments", tags=["Medical Assignments"]
)


@medical_assignment_router.post(
    "/", status_code=status.HTTP_201_CREATED, response_model=MedicalAssignmentResponse
)
async def create_medical_assignment(
    data: MedicalAssignmentCreate,
    user: Annotated[User, Depends(require_roles(UserRole.VOLUNTEER))],
    service: Annotated[
        MedicalAssignmentServiceProtocol, Depends(get_medical_assignment_service)
    ],
):
    return await service.create(data, user)


@medical_assignment_router.get("/", response_model=list[MedicalAssignmentResponse])
async def get_medical_assignments(
    user: Annotated[
        User,
        Depends(
            require_roles(UserRole.ADMIN, UserRole.VOLUNTEER, UserRole.VETERINARIAN)
        ),
    ],
    service: Annotated[
        MedicalAssignmentServiceProtocol, Depends(get_medical_assignment_service)
    ],
    filters: Annotated[MedicalAssignmentFilterParams, Depends()],
    volunteer_service: Annotated[
        VolunteerServiceProtocol, Depends(get_volunteer_service)
    ],
    limit: int = Query(default=20, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
):
    if user.role == UserRole.VOLUNTEER:
        await volunteer_service.require_approved_volunteer(user.id)
    return await service.get_all(filters, limit, offset, user)


@medical_assignment_router.get(
    "/{assignment_id}", response_model=MedicalAssignmentResponse
)
async def get_medical_assignment(
    assignment_id: int,
    user: Annotated[
        User,
        Depends(
            require_roles(UserRole.ADMIN, UserRole.VOLUNTEER, UserRole.VETERINARIAN)
        ),
    ],
    service: Annotated[
        MedicalAssignmentServiceProtocol, Depends(get_medical_assignment_service)
    ],
    volunteer_service: Annotated[
        VolunteerServiceProtocol, Depends(get_volunteer_service)
    ],
):
    if user.role == UserRole.VOLUNTEER:
        await volunteer_service.require_approved_volunteer(user.id)
    return await service.get_authorized_by_id(assignment_id, user)


@medical_assignment_router.patch(
    "/{assignment_id}/claim", response_model=MedicalAssignmentResponse
)
async def claim_medical_assignment(
    assignment_id: int,
    user: Annotated[User, Depends(require_roles(UserRole.VETERINARIAN))],
    service: Annotated[
        MedicalAssignmentServiceProtocol, Depends(get_medical_assignment_service)
    ],
):
    return await service.claim(assignment_id, user)


@medical_assignment_router.patch(
    "/{assignment_id}/start", response_model=MedicalAssignmentResponse
)
async def start_medical_assignment(
    assignment_id: int,
    user: Annotated[User, Depends(require_roles(UserRole.VETERINARIAN))],
    service: Annotated[
        MedicalAssignmentServiceProtocol, Depends(get_medical_assignment_service)
    ],
):
    return await service.start(assignment_id, user)


@medical_assignment_router.patch(
    "/{assignment_id}/ready-for-pickup", response_model=MedicalAssignmentResponse
)
async def mark_ready_for_pickup(
    assignment_id: int,
    user: Annotated[User, Depends(require_roles(UserRole.VETERINARIAN))],
    service: Annotated[
        MedicalAssignmentServiceProtocol, Depends(get_medical_assignment_service)
    ],
):
    return await service.ready_for_pickup(assignment_id, user)


@medical_assignment_router.patch(
    "/{assignment_id}/release", response_model=MedicalAssignmentResponse
)
async def release_medical_assignment(
    assignment_id: int,
    user: Annotated[
        User, Depends(require_roles(UserRole.VOLUNTEER, UserRole.ADMIN))
    ],
    service: Annotated[
        MedicalAssignmentServiceProtocol, Depends(get_medical_assignment_service)
    ],
    volunteer_service: Annotated[
        VolunteerServiceProtocol, Depends(get_volunteer_service)
    ],
):
    if user.role == UserRole.VOLUNTEER:
        await volunteer_service.require_approved_volunteer(user.id)
    return await service.release(assignment_id, user)


@medical_assignment_router.patch(
    "/{assignment_id}/cancel", response_model=MedicalAssignmentResponse
)
async def cancel_medical_assignment(
    assignment_id: int,
    user: Annotated[User, Depends(require_roles(UserRole.ADMIN))],
    service: Annotated[
        MedicalAssignmentServiceProtocol, Depends(get_medical_assignment_service)
    ],
):
    return await service.cancel(assignment_id, user)


@medical_assignment_router.patch(
    "/{assignment_id}/reassign", response_model=MedicalAssignmentResponse
)
async def reassign_medical_assignment(
    assignment_id: int,
    data: MedicalAssignmentReassign,
    user: Annotated[User, Depends(require_roles(UserRole.ADMIN))],
    service: Annotated[
        MedicalAssignmentServiceProtocol, Depends(get_medical_assignment_service)
    ],
):
    return await service.reassign(assignment_id, data.veterinarian_id, user)
