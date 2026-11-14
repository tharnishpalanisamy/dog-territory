from typing import Annotated

from fastapi import APIRouter, Depends, status

from app.core import UserRole
from app.dependencies import (
    get_medical_assignment_service,
    get_medical_assignment_update_service,
    get_volunteer_service,
    require_roles,
)
from app.models import User
from app.schemas import (
    MedicalAssignmentUpdateCreate,
    MedicalAssignmentUpdatePatch,
    MedicalAssignmentUpdateResponse,
)
from app.services.protocol import (
    MedicalAssignmentServiceProtocol,
    MedicalAssignmentUpdateServiceProtocol,
    VolunteerServiceProtocol,
)

medical_assignment_update_router = APIRouter(tags=["Medical Assignment Updates"])
assignment_updates_router = APIRouter(prefix="/medical-assignments")
updates_router = APIRouter(prefix="/medical-assignment-updates")


@assignment_updates_router.post(
    "/{assignment_id}/updates",
    status_code=status.HTTP_201_CREATED,
    response_model=MedicalAssignmentUpdateResponse,
)
async def create_medical_assignment_update(
    assignment_id: int,
    data: MedicalAssignmentUpdateCreate,
    user: Annotated[User, Depends(require_roles(UserRole.VETERINARIAN))],
    service: Annotated[
        MedicalAssignmentUpdateServiceProtocol,
        Depends(get_medical_assignment_update_service),
    ],
):
    return await service.create_update(assignment_id, data, user)


@assignment_updates_router.get(
    "/{assignment_id}/updates",
    response_model=list[MedicalAssignmentUpdateResponse],
)
async def get_medical_assignment_updates(
    assignment_id: int,
    user: Annotated[
        User,
        Depends(
            require_roles(UserRole.ADMIN, UserRole.VETERINARIAN, UserRole.VOLUNTEER)
        ),
    ],
    service: Annotated[
        MedicalAssignmentUpdateServiceProtocol,
        Depends(get_medical_assignment_update_service),
    ],
    assignment_service: Annotated[
        MedicalAssignmentServiceProtocol, Depends(get_medical_assignment_service)
    ],
    volunteer_service: Annotated[
        VolunteerServiceProtocol, Depends(get_volunteer_service)
    ],
):
    if user.role == UserRole.VOLUNTEER:
        await volunteer_service.require_approved_volunteer(user.id)
    await assignment_service.get_authorized_by_id(assignment_id, user)
    return await service.get_updates(assignment_id)


@updates_router.get("/{update_id}", response_model=MedicalAssignmentUpdateResponse)
async def get_medical_assignment_update(
    update_id: int,
    user: Annotated[
        User,
        Depends(
            require_roles(UserRole.ADMIN, UserRole.VETERINARIAN, UserRole.VOLUNTEER)
        ),
    ],
    service: Annotated[
        MedicalAssignmentUpdateServiceProtocol,
        Depends(get_medical_assignment_update_service),
    ],
    assignment_service: Annotated[
        MedicalAssignmentServiceProtocol, Depends(get_medical_assignment_service)
    ],
    volunteer_service: Annotated[
        VolunteerServiceProtocol, Depends(get_volunteer_service)
    ],
):
    if user.role == UserRole.VOLUNTEER:
        await volunteer_service.require_approved_volunteer(user.id)
    return await service.get_update_for_user(update_id, user)


@updates_router.patch("/{update_id}", response_model=MedicalAssignmentUpdateResponse)
async def patch_medical_assignment_update(
    update_id: int,
    data: MedicalAssignmentUpdatePatch,
    user: Annotated[User, Depends(require_roles(UserRole.VETERINARIAN))],
    service: Annotated[
        MedicalAssignmentUpdateServiceProtocol,
        Depends(get_medical_assignment_update_service),
    ],
):
    return await service.update_update(update_id, data, user)


@updates_router.delete("/{update_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_medical_assignment_update(
    update_id: int,
    user: Annotated[User, Depends(require_roles(UserRole.ADMIN))],
    service: Annotated[
        MedicalAssignmentUpdateServiceProtocol,
        Depends(get_medical_assignment_update_service),
    ],
):
    await service.delete_update(update_id, user)


medical_assignment_update_router.include_router(assignment_updates_router)
medical_assignment_update_router.include_router(updates_router)
