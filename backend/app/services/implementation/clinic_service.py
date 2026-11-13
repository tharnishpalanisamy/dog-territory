from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.exceptions import ClinicInUseException, ClinicNotFoundException
from app.models import Clinic
from app.repositories.protocols import ClinicRepositoryProtocol
from app.schemas import ClinicCreate, ClinicFilterParams, ClinicUpdate


class ClinicService:
    def __init__(self, db: AsyncSession, repository: ClinicRepositoryProtocol):
        self.db = db
        self.repository = repository

    async def create(self, data: ClinicCreate) -> Clinic:
        clinic = Clinic(**data.model_dump())
        try:
            result = await self.repository.create(clinic)
            await self.db.commit()
            return result
        except Exception:
            await self.db.rollback()
            raise

    async def get_all(
        self, filters: ClinicFilterParams, limit: int, offset: int
    ) -> list[Clinic]:
        return await self.repository.get_all(filters, limit, offset)

    async def get_by_id(self, clinic_id: int) -> Clinic:
        clinic = await self.repository.get_by_id(clinic_id)
        if clinic is None:
            raise ClinicNotFoundException(f"Clinic with id {clinic_id} not found")
        return clinic

    async def update(self, clinic_id: int, data: ClinicUpdate) -> Clinic:
        clinic = await self.get_by_id(clinic_id)
        try:
            result = await self.repository.update(
                clinic, data.model_dump(exclude_unset=True)
            )
            await self.db.commit()
            return result
        except Exception:
            await self.db.rollback()
            raise

    async def delete(self, clinic_id: int) -> None:
        clinic = await self.get_by_id(clinic_id)
        try:
            await self.repository.delete(clinic)
            await self.db.commit()
        except IntegrityError as exc:
            await self.db.rollback()
            raise ClinicInUseException(
                "Clinic cannot be deleted while veterinarians or assignments refer to it"
            ) from exc
        except Exception:
            await self.db.rollback()
            raise
