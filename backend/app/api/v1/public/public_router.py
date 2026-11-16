from typing import Annotated

from app.dependencies import get_public_service
from app.services.protocol import PublicServiceProtocol
from fastapi import APIRouter, Depends

router = APIRouter(prefix="/public", tags=["public"])


@router.get("/stats")
async def get_statistics(
    service: Annotated[PublicServiceProtocol, Depends(get_public_service)],
):
    return await service.get_statistics()

