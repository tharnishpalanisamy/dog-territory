from typing import Annotated

from app.core import UserRole
from app.dependencies import get_veterinary_record_service, require_roles
from app.models import User
from app.schemas import VeterinaryRecordCreate
from app.services.protocol import VeterinaryRecordServiceProtocol
from fastapi import APIRouter, Depends, status

router = APIRouter(prefix="/veterinary-record", tags=["Veterinary Records"])


@router.post(
    "/", summary="create veterinary record", status_code=status.HTTP_201_CREATED
)
async def create_veterinary_record(
    data: VeterinaryRecordCreate,
    user: Annotated[User, Depends(require_roles(UserRole.VETERINARIAN))],
    service: Annotated[
        VeterinaryRecordServiceProtocol, Depends(get_veterinary_record_service)
    ],
):
    return await service.create_veterinary_record(data, user)


