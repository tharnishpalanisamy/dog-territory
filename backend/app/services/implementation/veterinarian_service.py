from datetime import UTC, datetime
from pathlib import Path
from uuid import uuid4

from fastapi import HTTPException, UploadFile, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core import UserRole, VeterinarianApprovalStatus
from app.models import User, Veterinarian
from app.repositories.protocols import (
    ClinicRepositoryProtocol,
    UserRepositoryProtocol,
    VeterinarianRepositoryProtocol,
)
from app.schemas import (
    VeterinarianApprovalUpdate,
    VeterinarianCreate,
    VeterinarianUpdate,
)

LICENSE_DIR = Path("uploads/licenses")
LICENSE_EXTENSIONS = {".pdf", ".png", ".jpg", ".jpeg", ".webp"}
MAX_LICENSE_SIZE = 10 * 1024 * 1024


class VeterinarianService:
    def __init__(
        self,
        db: AsyncSession,
        repository: VeterinarianRepositoryProtocol,
        clinic_repository: ClinicRepositoryProtocol,
        user_repository: UserRepositoryProtocol,
    ):
        self.db = db
        self.repository = repository
        self.clinic_repository = clinic_repository
        self.user_repository = user_repository

    async def _save_document(self, document: UploadFile | None) -> str | None:
        if document is None or not document.filename:
            return None
        extension = Path(document.filename).suffix.lower()
        if extension not in LICENSE_EXTENSIONS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="License document must be a PDF or image file",
            )
        content = await document.read(MAX_LICENSE_SIZE + 1)
        await document.seek(0)
        if len(content) > MAX_LICENSE_SIZE:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail="License document must be 10 MB or smaller",
            )
        LICENSE_DIR.mkdir(parents=True, exist_ok=True)
        path = LICENSE_DIR / f"{uuid4()}{extension}"
        path.write_bytes(content)
        return str(path)

    @staticmethod
    def _remove_document(path: str | None) -> None:
        if path:
            Path(path).unlink(missing_ok=True)

    async def _validate_clinic(self, clinic_id: int) -> None:
        if await self.clinic_repository.get_by_id(clinic_id) is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Clinic with id {clinic_id} not found",
            )

    async def apply(
        self, user: User, data: VeterinarianCreate, document: UploadFile | None
    ) -> Veterinarian:
        if await self.repository.get_by_user_id(user.id):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="A veterinarian application already exists for this user",
            )
        await self._validate_clinic(data.clinic_id)
        if await self.repository.license_number_exists(data.license_number):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="License number is already registered",
            )

        document_path = await self._save_document(document)
        veterinarian = Veterinarian(
            user_id=user.id,
            **data.model_dump(),
            license_document_path=document_path,
            approval_status=VeterinarianApprovalStatus.PENDING,
        )
        try:
            await self.repository.create(veterinarian)
            await self.db.commit()
            return veterinarian
        except IntegrityError as exc:
            await self.db.rollback()
            self._remove_document(document_path)
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="A veterinarian application or license number already exists",
            ) from exc
        except Exception:
            await self.db.rollback()
            self._remove_document(document_path)
            raise

    async def get_mine(self, user: User) -> Veterinarian:
        veterinarian = await self.repository.get_by_user_id(user.id)
        if veterinarian is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Veterinarian application not found",
            )
        return veterinarian

    async def update_mine(
        self, user: User, data: VeterinarianUpdate, document: UploadFile | None
    ) -> Veterinarian:
        veterinarian = await self.get_mine(user)
        fields = data.model_dump(exclude_unset=True)
        if "clinic_id" in fields and fields["clinic_id"] is not None:
            await self._validate_clinic(fields["clinic_id"])
        if "license_number" in fields and fields["license_number"] is not None:
            if await self.repository.license_number_exists(
                fields["license_number"], exclude_id=veterinarian.id
            ):
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="License number is already registered",
                )

        document_path = await self._save_document(document)
        old_document_path = veterinarian.license_document_path
        if document_path:
            fields["license_document_path"] = document_path
        needs_reverification = any(
            fields.get(field) is not None
            and fields.get(field) != getattr(veterinarian, field)
            for field in ("license_number", "qualification")
        )
        if needs_reverification:
            fields.update(
                approval_status=VeterinarianApprovalStatus.PENDING,
                reviewed_by=None,
                reviewed_at=None,
                rejection_reason=None,
            )
        try:
            await self.repository.update(veterinarian, fields)
            if needs_reverification and user.role == UserRole.VETERINARIAN:
                user.role = UserRole.USER
            await self.db.commit()
            if document_path:
                self._remove_document(old_document_path)
            return veterinarian
        except IntegrityError as exc:
            await self.db.rollback()
            self._remove_document(document_path)
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="License number is already registered",
            ) from exc
        except Exception:
            await self.db.rollback()
            self._remove_document(document_path)
            raise

    async def get_all(
        self,
        approval_status: VeterinarianApprovalStatus | None,
        clinic_id: int | None,
        page: int,
        limit: int,
    ) -> list[Veterinarian]:
        return await self.repository.get_all(
            approval_status, clinic_id, limit, (page - 1) * limit
        )

    async def get_pending(self, page: int, limit: int) -> list[Veterinarian]:
        return await self.get_all(
            VeterinarianApprovalStatus.PENDING, None, page, limit
        )

    async def get_by_id(self, veterinarian_id: int) -> Veterinarian:
        veterinarian = await self.repository.get_by_id(veterinarian_id)
        if veterinarian is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Veterinarian application not found",
            )
        return veterinarian

    async def update_approval(
        self,
        veterinarian_id: int,
        admin: User,
        data: VeterinarianApprovalUpdate,
    ) -> Veterinarian:
        veterinarian = await self.get_by_id(veterinarian_id)
        if (
            data.approval_status == VeterinarianApprovalStatus.REJECTED
            and not data.rejection_reason
        ):
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="A rejection reason is required when rejecting an application",
            )
        try:
            await self.repository.update(
                veterinarian,
                {
                    "approval_status": data.approval_status,
                    "reviewed_by": admin.id,
                    "reviewed_at": datetime.now(UTC),
                    "rejection_reason": (
                        data.rejection_reason
                        if data.approval_status == VeterinarianApprovalStatus.REJECTED
                        else None
                    ),
                },
            )
            if data.approval_status == VeterinarianApprovalStatus.APPROVED:
                user = await self.user_repository.get_by_id(veterinarian.user_id)
                if user is None:
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail="User for veterinarian application not found",
                    )
                user.role = UserRole.VETERINARIAN
            await self.db.commit()
            return veterinarian
        except Exception:
            await self.db.rollback()
            raise
