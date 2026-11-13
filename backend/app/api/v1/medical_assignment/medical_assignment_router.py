from typing import Annotated

from fastapi import APIRouter, Depends, Query, status

from app.core import UserRole
from app.dependencies import (
    get_medical_assignment_service,
    get_medical_assignment_update_service,
    require_roles,
)
from app.models import User
from app.schemas import (
    MedicalAssignmentCreate,
    MedicalAssignmentFilterParams,
    MedicalAssignmentReassign,
    MedicalAssignmentResponse,
    MedicalAssignmentUpdateCreate,
    MedicalAssignmentUpdatePatch,
    MedicalAssignmentUpdateResponse,
)
from app.services.protocol import (
    MedicalAssignmentServiceProtocol,
    MedicalAssignmentUpdateServiceProtocol,
)

medical_assignment_router = APIRouter(tags=["Medical Assignments"])
router = APIRouter(prefix="/medical-assignments")
updates_router = APIRouter(prefix="/medical-assignment-updates")


@router.post("/", status_code=status.HTTP_201_CREATED, response_model=MedicalAssignmentResponse)
async def create_medical_assignment(
    data: MedicalAssignmentCreate,
    user: Annotated[User, Depends(require_roles(UserRole.VOLUNTEER))],
    service: Annotated[MedicalAssignmentServiceProtocol, Depends(get_medical_assignment_service)],
):
    return await service.create(data, user)


@router.get("/", response_model=list[MedicalAssignmentResponse])
async def get_medical_assignments(
    user: Annotated[User, Depends(require_roles(UserRole.ADMIN, UserRole.VOLUNTEER, UserRole.VETERINARIAN))],
    service: Annotated[MedicalAssignmentServiceProtocol, Depends(get_medical_assignment_service)],
    filters: Annotated[MedicalAssignmentFilterParams, Depends()],
    limit: int = Query(default=20, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
):
    return await service.get_all(filters, limit, offset, user)


@router.get("/{assignment_id}", response_model=MedicalAssignmentResponse)
async def get_medical_assignment(
    assignment_id: int,
    user: Annotated[User, Depends(require_roles(UserRole.ADMIN, UserRole.VOLUNTEER, UserRole.VETERINARIAN))],
    service: Annotated[MedicalAssignmentServiceProtocol, Depends(get_medical_assignment_service)],
):
    return await service.get_authorized_by_id(assignment_id, user)


@router.patch("/{assignment_id}/claim", response_model=MedicalAssignmentResponse)
async def claim_medical_assignment(
    assignment_id: int,
    user: Annotated[User, Depends(require_roles(UserRole.VETERINARIAN))],
    service: Annotated[MedicalAssignmentServiceProtocol, Depends(get_medical_assignment_service)],
):
    return await service.claim(assignment_id, user)


@router.patch("/{assignment_id}/start", response_model=MedicalAssignmentResponse)
async def start_medical_assignment(
    assignment_id: int,
    user: Annotated[User, Depends(require_roles(UserRole.VETERINARIAN))],
    service: Annotated[MedicalAssignmentServiceProtocol, Depends(get_medical_assignment_service)],
):
    return await service.start(assignment_id, user)


@router.patch("/{assignment_id}/ready-for-pickup", response_model=MedicalAssignmentResponse)
async def mark_ready_for_pickup(
    assignment_id: int,
    user: Annotated[User, Depends(require_roles(UserRole.VETERINARIAN))],
    service: Annotated[MedicalAssignmentServiceProtocol, Depends(get_medical_assignment_service)],
):
    return await service.ready_for_pickup(assignment_id, user)


@router.patch("/{assignment_id}/release", response_model=MedicalAssignmentResponse)
async def release_medical_assignment(
    assignment_id: int,
    user: Annotated[User, Depends(require_roles(UserRole.VOLUNTEER, UserRole.ADMIN))],
    service: Annotated[MedicalAssignmentServiceProtocol, Depends(get_medical_assignment_service)],
):
    return await service.release(assignment_id, user)


@router.patch("/{assignment_id}/cancel", response_model=MedicalAssignmentResponse)
async def cancel_medical_assignment(
    assignment_id: int,
    user: Annotated[User, Depends(require_roles(UserRole.ADMIN))],
    service: Annotated[MedicalAssignmentServiceProtocol, Depends(get_medical_assignment_service)],
):
    return await service.cancel(assignment_id, user)


@router.patch("/{assignment_id}/reassign", response_model=MedicalAssignmentResponse)
async def reassign_medical_assignment(
    assignment_id: int,
    data: MedicalAssignmentReassign,
    user: Annotated[User, Depends(require_roles(UserRole.ADMIN))],
    service: Annotated[MedicalAssignmentServiceProtocol, Depends(get_medical_assignment_service)],
):
    return await service.reassign(assignment_id, data.veterinarian_id, user)


@router.post("/{assignment_id}/updates", status_code=status.HTTP_201_CREATED, response_model=MedicalAssignmentUpdateResponse)
async def create_medical_assignment_update(
    assignment_id: int,
    data: MedicalAssignmentUpdateCreate,
    user: Annotated[User, Depends(require_roles(UserRole.VETERINARIAN))],
    service: Annotated[MedicalAssignmentUpdateServiceProtocol, Depends(get_medical_assignment_update_service)],
):
    return await service.create_update(assignment_id, data, user)


@router.get("/{assignment_id}/updates", response_model=list[MedicalAssignmentUpdateResponse])
async def get_medical_assignment_updates(
    assignment_id: int,
    user: Annotated[User, Depends(require_roles(UserRole.ADMIN, UserRole.VETERINARIAN, UserRole.VOLUNTEER))],
    service: Annotated[MedicalAssignmentUpdateServiceProtocol, Depends(get_medical_assignment_update_service)],
    assignment_service: Annotated[MedicalAssignmentServiceProtocol, Depends(get_medical_assignment_service)],
):
    await assignment_service.get_authorized_by_id(assignment_id, user)
    return await service.get_updates(assignment_id)


@updates_router.get("/{update_id}", response_model=MedicalAssignmentUpdateResponse)
async def get_medical_assignment_update(
    update_id: int,
    user: Annotated[User, Depends(require_roles(UserRole.ADMIN, UserRole.VETERINARIAN, UserRole.VOLUNTEER))],
    service: Annotated[MedicalAssignmentUpdateServiceProtocol, Depends(get_medical_assignment_update_service)],
    assignment_service: Annotated[MedicalAssignmentServiceProtocol, Depends(get_medical_assignment_service)],
):
    return await service.get_update_for_user(update_id, user)


@updates_router.patch("/{update_id}", response_model=MedicalAssignmentUpdateResponse)
async def patch_medical_assignment_update(
    update_id: int,
    data: MedicalAssignmentUpdatePatch,
    user: Annotated[User, Depends(require_roles(UserRole.VETERINARIAN))],
    service: Annotated[MedicalAssignmentUpdateServiceProtocol, Depends(get_medical_assignment_update_service)],
):
    return await service.update_update(update_id, data, user)


@updates_router.delete("/{update_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_medical_assignment_update(
    update_id: int,
    user: Annotated[User, Depends(require_roles(UserRole.ADMIN))],
    service: Annotated[MedicalAssignmentUpdateServiceProtocol, Depends(get_medical_assignment_update_service)],
):
    await service.delete_update(update_id, user)


medical_assignment_router.include_router(router)
medical_assignment_router.include_router(updates_router)
