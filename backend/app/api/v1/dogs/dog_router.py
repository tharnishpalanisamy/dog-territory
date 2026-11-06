from typing import Annotated

from app.core import UserRole
from app.dependencies import get_dog_service, require_roles
from app.models import User
from app.schemas import (
    DogCreate,
    DogDetailResponse,
    DogFilterParams,
    DogSummaryResponse,
    DogUpdate,
)
from app.services.protocol import DogServiceProtocol
from fastapi import APIRouter, Depends, Query, Response, status

router = APIRouter(prefix="/api/v1/dogs", tags=["Dog"])


# CREATE DOG
@router.post(
    "/",
    response_model=DogDetailResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_dog(
    dog_data: DogCreate,
    service: Annotated[DogServiceProtocol, Depends(get_dog_service)],
    user: Annotated[User, Depends(require_roles(UserRole.ADMIN, UserRole.VOLUNTEER))],
):
    return await service.create_dog(dog_data, user)


# GET ALL DOGS (SUMMARY)
@router.get(
    "/",
    response_model=list[DogSummaryResponse],
)
async def get_all_dogs(
    user: Annotated[
        User,
        Depends(
            require_roles(
                UserRole.ADMIN,
                UserRole.VOLUNTEER,
            )
        ),
    ],
    service: Annotated[DogServiceProtocol, Depends(get_dog_service)],
    filters: Annotated[DogFilterParams, Depends()],
    limit: int = Query(ge=1,le=100 , default=20),
    offset: int = Query(ge=0, default=0),
):
    return await service.get_all_dogs(
        filters=filters,
        limit=limit,
        offset=offset,
    )


# GET DOG BY ID (DETAIL)
@router.get(
    "/{dog_id:int}",
    response_model=DogDetailResponse,
)
async def get_dog_by_id(
    dog_id: int,
    user: Annotated[
        User,
        Depends(
            require_roles(
                UserRole.USER,
                UserRole.ADMIN,
                UserRole.VOLUNTEER,
                UserRole.VETERINARIAN,
            )
        ),
    ],
    service: Annotated[DogServiceProtocol, Depends(get_dog_service)],
):
    return await service.get_dog_by_id(dog_id)


# UPDATE DOG BY ID
@router.patch(
    "/{dog_id:int}",
    response_model=DogDetailResponse,
)
async def update_dog_by_id(
    dog_id: int,
    dog_data: DogUpdate,
    user: Annotated[User, Depends(require_roles(UserRole.ADMIN, UserRole.VOLUNTEER))],
    service: Annotated[DogServiceProtocol, Depends(get_dog_service)],
):
    return await service.update_dog_by_id(dog_id, dog_data)


# UPDATE DOG BY DOG CODE
@router.patch(
    "/code/{dog_code}",
    response_model=DogDetailResponse,
)
async def update_dog_by_dog_code(
    dog_code: str,
    dog_data: DogUpdate,
    user: Annotated[User, Depends(require_roles(UserRole.ADMIN, UserRole.VOLUNTEER))],
    service: Annotated[DogServiceProtocol, Depends(get_dog_service)],
):
    return await service.update_dog_by_dog_code(dog_code, dog_data)


# DELETE DOG BY ID
@router.delete(
    "/{dog_id:int}",
    status_code=status.HTTP_204_NO_CONTENT,
    response_class=Response,
)
async def delete_dog_by_id(
    dog_id: int,
    user: Annotated[User, Depends(require_roles(UserRole.ADMIN))],
    service: Annotated[DogServiceProtocol, Depends(get_dog_service)],
):
    await service.delete_dog_by_id(dog_id)


# GET DOG BY DOG CODE (DETAIL)
@router.get(
    "/code/{dog_code}",
    response_model=DogDetailResponse,
)
async def get_dog_by_dog_code(
    dog_code: str,
    user: Annotated[
        User,
        Depends(
            require_roles(
                UserRole.USER,
                UserRole.ADMIN,
                UserRole.VOLUNTEER,
                UserRole.VETERINARIAN,
            )
        ),
    ],
    service: Annotated[DogServiceProtocol, Depends(get_dog_service)],
):
    return await service.get_dog_by_dog_code(dog_code)


# DELETE DOG BY DOG CODE
@router.delete(
    "/code/{dog_code}",
    status_code=status.HTTP_204_NO_CONTENT,
    response_class=Response,
)
async def delete_dog_by_dog_code(
    dog_code: str,
    user: Annotated[User, Depends(require_roles(UserRole.ADMIN))],
    service: Annotated[DogServiceProtocol, Depends(get_dog_service)],
):
    await service.delete_dog_by_dog_code(dog_code)
