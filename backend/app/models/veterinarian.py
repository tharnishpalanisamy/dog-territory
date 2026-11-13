from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import (
    DateTime,
    Enum,
    ForeignKey,
    Integer,
    String,
    Text,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core import VeterinarianApprovalStatus
from app.database.base import Base

if TYPE_CHECKING:
    from app.models.clinic import Clinic
    from app.models.medical_assignment import MedicalAssignment
    from app.models.user import User


class Veterinarian(Base):
    __tablename__ = "veterinarians"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
        index=True,
    )

    clinic_id: Mapped[int] = mapped_column(
        ForeignKey("clinics.id", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )

    full_name: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
    )

    phone: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
    )

    qualification: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
    )

    license_number: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        nullable=False,
        index=True,
    )

    specialization: Mapped[str | None] = mapped_column(
        String(150),
        nullable=True,
    )

    years_of_experience: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )

    license_document_path: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    approval_status: Mapped[VeterinarianApprovalStatus] = mapped_column(
        Enum(
            VeterinarianApprovalStatus,
            name="veterinarian_approval_status_enum",
            native_enum=True,
            values_callable=lambda enum: [e.value for e in enum],
        ),
        default=VeterinarianApprovalStatus.PENDING,
        nullable=False,
        index=True,
    )

    reviewed_by: Mapped[int | None] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
    )

    reviewed_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    rejection_reason: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    # Relationships

    user: Mapped["User"] = relationship(
        foreign_keys=[user_id],
    )

    reviewer: Mapped["User | None"] = relationship(
        foreign_keys=[reviewed_by],
    )

    clinic: Mapped["Clinic"] = relationship(
        back_populates="veterinarians",
    )

    medical_assignments: Mapped[list["MedicalAssignment"]] = relationship(
        back_populates="veterinarian",
        foreign_keys="MedicalAssignment.veterinarian_id",
    )
