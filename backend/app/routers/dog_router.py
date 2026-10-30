from typing import Annotated

from fastapi import APIRouter, Depends

from app.core import UserRole
from app.dependencies import get_dog_service, require_roles
from app.models import User
from app.schemas import DogCreate
from app.services.protocol import DogServiceProtocol

router = APIRouter(prefix="/api/dogs", tags=["Dog"])


@router.get("/")
async def get_all_dogs():
    pass


@router.post("/")
async def create_dog(
    dog_data: DogCreate,
    service: Annotated[DogServiceProtocol, Depends(get_dog_service)],
    user: Annotated[User, Depends(require_roles(UserRole.ADMIN, UserRole.VOLUNTEER))],
):
    return await service.create_dog(dog_data) 
