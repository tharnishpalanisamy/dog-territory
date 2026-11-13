from typing import Annotated

from app.core import UserRole
from app.dependencies import get_work_assignment_update_service, require_roles
from app.models import User
from app.schemas import (
    AssignmentUpdateCreate,
    AssignmentUpdateFilterParams,
    AssignmentUpdatePatch,
    AssignmentUpdateResponse,
)
from app.services.protocol import WorkAssignmentUpdateServiceProtocol
from fastapi import APIRouter, Depends, Query, status

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
    user: Annotated[
        User, Depends(require_roles(UserRole.ADMIN, UserRole.VOLUNTEER))
    ],
    service: Annotated[
        WorkAssignmentUpdateServiceProtocol,
        Depends(get_work_assignment_update_service),
    ],
):
    return await service.get_update_by_id(update_id)


@router.post(
    "/{assignment_id}/updates", response_model=AssignmentUpdateResponse
)
async def updates_assignment(
    assignment_id: int,
    data: AssignmentUpdateCreate,
    user: Annotated[User, Depends(require_roles(UserRole.ADMIN, UserRole.VOLUNTEER))],
    service: Annotated[
        WorkAssignmentUpdateServiceProtocol,
        Depends(get_work_assignment_update_service),
    ],
):
    return await service.create_update(assignment_id, data, user)


@router.patch("/{update_id}", response_model=AssignmentUpdateResponse)
async def update_assignment_update(
    update_id: int,
    data: AssignmentUpdatePatch,
    user: Annotated[
        User, Depends(require_roles(UserRole.ADMIN, UserRole.VOLUNTEER))
    ],
    service: Annotated[
        WorkAssignmentUpdateServiceProtocol,
        Depends(get_work_assignment_update_service),
    ],
):
    return await service.update_update(update_id, data, user)


@router.delete("/{update_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_assignment_update(
    update_id: int,
    user: Annotated[
        User, Depends(require_roles(UserRole.ADMIN, UserRole.VOLUNTEER))
    ],
    service: Annotated[
        WorkAssignmentUpdateServiceProtocol,
        Depends(get_work_assignment_update_service),
    ],
):
    await service.delete_update(update_id, user)
