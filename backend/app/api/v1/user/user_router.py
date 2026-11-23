from typing import Annotated

from app.dependencies import get_current_user, get_dashboard_service, get_user_service
from app.models import User
from app.schemas import UserLocationResponse, UserLocationUpdate, UserPhoneNumberUpdate, UserProfileResponse, UserProfileUpdate
from app.services.protocol import DashboardServiceProtocol, UserServiceProtocol
from fastapi import APIRouter, Depends

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/statistics")
async def get_user_statistics(
    user: Annotated[User, Depends(get_current_user)],
    service: Annotated[DashboardServiceProtocol, Depends(get_dashboard_service)],
):
    return await service.get_user_statistics(user)


@router.patch("/me/location")
async def update_user_location(
    location: UserLocationUpdate,
    user: Annotated[User, Depends(get_current_user)],
    service: Annotated[UserServiceProtocol, Depends(get_user_service)],
) -> UserLocationResponse:
    return await service.update_user_location(user, location)


@router.patch("/me/phone")
async def update_user_phone(
    phone: UserPhoneNumberUpdate,
    user: Annotated[User, Depends(get_current_user)],
    service: Annotated[UserServiceProtocol, Depends(get_user_service)],
) -> UserProfileResponse:
    return await service.update_user_phone(user, phone)


@router.patch("/me")
async def update_user_profile(
    profile: UserProfileUpdate,
    user: Annotated[User, Depends(get_current_user)],
    service: Annotated[UserServiceProtocol, Depends(get_user_service)],
) -> UserProfileResponse:
    return await service.update_user_profile(user, profile)


@router.get("/me", response_model=UserProfileResponse)
async def get_current_user_profile(
    user: Annotated[User, Depends(get_current_user)],
) -> User:
    return user
