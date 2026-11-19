from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.repositories.implementation import VeterinaryRecordRepository
from app.repositories.protocols import VeterinaryRecordRepositoryProtocol
from app.services.implementation import VeterinaryRecordService
from app.services.protocol import VeterinaryRecordServiceProtocol


def get_veterinary_record_repository(
    db: Annotated[AsyncSession, Depends(get_db)],
) -> VeterinaryRecordRepositoryProtocol:
    return VeterinaryRecordRepository(db)


def get_veterinary_record_service(
    db: Annotated[AsyncSession, Depends(get_db)],
    repository: Annotated[
        VeterinaryRecordRepositoryProtocol, Depends(get_veterinary_record_repository)
    ],
) -> VeterinaryRecordServiceProtocol:
    return VeterinaryRecordService(db, repository)
