from typing import Annotated

from fastapi import APIRouter, Depends, Query, status

from app.core import UserRole
from app.dependencies import (
    get_volunteer_service,
    require_roles,
)
from app.models import User
from app.schemas import (
    VolunteerApprovalUpdate,
    VolunteerCreate,
    VolunteerResponse,
    VolunteerUpdate,
)
from app.services.protocol import VolunteerServiceProtocol

router = APIRouter(prefix="/volunteers", tags=["Volunteers"])


@router.post("/", status_code=status.HTTP_201_CREATED, response_model=VolunteerResponse)
async def create_volunteer_profile(
    data: VolunteerCreate,
    user: Annotated[
        User,
        Depends(require_roles(UserRole.USER)),
    ],
    service: Annotated[
        VolunteerServiceProtocol,
        Depends(get_volunteer_service),
    ],
):
    return await service.create_profile(user.id, data)


@router.get("/me", response_model=VolunteerResponse)
async def get_my_volunteer_profile(
    user: Annotated[
        User,
        Depends(require_roles(UserRole.VOLUNTEER)),
    ],
    service: Annotated[
        VolunteerServiceProtocol,
        Depends(get_volunteer_service),
    ],
):
    return await service.get_by_user_id(user.id)


@router.patch("/me", response_model=VolunteerResponse)
async def update_my_volunteer_profile(
    data: VolunteerUpdate,
    user: Annotated[
        User,
        Depends(require_roles(UserRole.VOLUNTEER)),
    ],
    service: Annotated[
        VolunteerServiceProtocol,
        Depends(get_volunteer_service),
    ],
):
    return await service.update_profile(user.id, data)


@router.get("/", response_model=list[VolunteerResponse])
async def get_all_volunteers(
    user: Annotated[
        User,
        Depends(require_roles(UserRole.ADMIN)),
    ],
    service: Annotated[
        VolunteerServiceProtocol,
        Depends(get_volunteer_service),
    ],
    limit: int = Query(default=10, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
):
    return await service.get_all(limit, offset)


@router.get("/{volunteer_id}", response_model=VolunteerResponse)
async def get_volunteer(
    volunteer_id: int,
    user: Annotated[
        User,
        Depends(require_roles(UserRole.ADMIN)),
    ],
    service: Annotated[
        VolunteerServiceProtocol,
        Depends(get_volunteer_service),
    ],
):
    return await service.get_by_id(volunteer_id)


@router.patch("/{volunteer_id}/approval", response_model=VolunteerResponse)
async def update_volunteer_approval(
    volunteer_id: int,
    data: VolunteerApprovalUpdate,
    user: Annotated[
        User,
        Depends(require_roles(UserRole.ADMIN)),
    ],
    service: Annotated[
        VolunteerServiceProtocol,
        Depends(get_volunteer_service),
    ],
):
    return await service.update_approval(volunteer_id, data)


@router.delete("/{volunteer_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_volunteer(
    volunteer_id: int,
    user: Annotated[
        User,
        Depends(require_roles(UserRole.ADMIN)),
    ],
    service: Annotated[
        VolunteerServiceProtocol,
        Depends(get_volunteer_service),
    ],
):
    await service.delete(volunteer_id)
