from typing import Annotated

from app.core import UserRole
from app.dependencies import get_dog_service, require_roles
from app.models import User
from app.schemas import DogCreate, DogResponse
from app.services.protocol import DogServiceProtocol
from fastapi import APIRouter, Depends, status

router = APIRouter(prefix="/api/v1/dogs", tags=["Dog"])


@router.post("/", response_model=DogResponse, status_code=status.HTTP_201_CREATED)
async def create_dog(
    dog_data: DogCreate,
    service: Annotated[DogServiceProtocol, Depends(get_dog_service)],
    user: Annotated[User, Depends(require_roles(UserRole.ADMIN, UserRole.VOLUNTEER))],
):
    return await service.create_dog(dog_data, user)


@router.get("/", response_model=list[DogResponse])
async def get_all_dogs(
    user: Annotated[
        User,
        Depends(
            require_roles(
                UserRole.USER, UserRole.ADMIN, UserRole.VOLUNTEER, UserRole.VETERINARIAN
            )
        ),
    ],
    service: Annotated[DogServiceProtocol, Depends(get_dog_service)],
):
    return await service.get_all_dogs()


@router.get('/{dog_id}' , response_model=DogResponse)  
async def get_dog_by_id(
    dog_id : int , 
    user: Annotated[
        User,
        Depends(
            require_roles(
                UserRole.USER, UserRole.ADMIN, UserRole.VOLUNTEER, UserRole.VETERINARIAN
            )
        ),
    ],
    service: Annotated[DogServiceProtocol, Depends(get_dog_service)],
):
    return await service.get_dog_by_id(dog_id)