from typing import Annotated

from app.dependencies import get_current_user, get_dashboard_service , get_auth_service
from app.models import User
from app.services.protocol import DashboardServiceProtocol
from fastapi import APIRouter, Depends

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/statistics")
async def get_user_statistics(
    user: Annotated[User, Depends(get_current_user)],
    service: Annotated[DashboardServiceProtocol, Depends(get_dashboard_service)],
):
    return await service.get_user_statistics(user)

@router.patch('/me/location') 
async def update_user_location(
    user: Annotated[User, Depends(get_current_user)], 
    service: Annotated[DashboardServiceProtocol, Depends(get_auth_service)],
) :
    return await service.update_location()