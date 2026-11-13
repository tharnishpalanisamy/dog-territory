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

from app.core import (
    MedicalAssignmentMode,
    MedicalAssignmentStatus,
)
from app.database.base import Base

if TYPE_CHECKING:
    from app.models.clinic import Clinic
    from app.models.dog import Dog
    from app.models.medical_assignment_update import MedicalAssignmentUpdate
    from app.models.user import User
    from app.models.veterinarian import Veterinarian
    from app.models.work_assignments import WorkAssignment


class MedicalAssignment(Base):
    __tablename__ = "medical_assignments"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    dog_id: Mapped[int | None] = mapped_column(
        ForeignKey("dogs.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    work_assignment_id: Mapped[int | None] = mapped_column(
        ForeignKey("work_assignments.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    clinic_id: Mapped[int] = mapped_column(
        ForeignKey("clinics.id", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )
    
    created_by: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="RESTRICT"),
        nullable=False,
    )

    volunteer_id: Mapped[int | None] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    veterinarian_id: Mapped[int | None] = mapped_column(
        ForeignKey("veterinarians.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    title: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
    )

    description: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    mode: Mapped[MedicalAssignmentMode] = mapped_column(
        Enum(
            MedicalAssignmentMode,
            name="medical_assignment_mode_enum",
            native_enum=True,
            values_callable=lambda enum: [e.value for e in enum],
        ),
        nullable=False,
    )

    status: Mapped[MedicalAssignmentStatus] = mapped_column(
        Enum(
            MedicalAssignmentStatus,
            name="medical_assignment_status_enum",
            native_enum=True,
            values_callable=lambda enum: [e.value for e in enum],
        ),
        default=MedicalAssignmentStatus.OPEN,
        nullable=False,
        index=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    claimed_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    completed_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    # Relationships

    dog: Mapped["Dog | None"] = relationship(
        back_populates="medical_assignments",
    )

    clinic: Mapped["Clinic"] = relationship(
        back_populates="medical_assignments",
    )

    creator: Mapped["User"] = relationship(
        foreign_keys=[created_by],
    )

    volunteer: Mapped["User | None"] = relationship(
        foreign_keys=[volunteer_id],
    )

    veterinarian: Mapped["Veterinarian | None"] = relationship(
        back_populates="medical_assignments",
        foreign_keys=[veterinarian_id],
    )

    updates: Mapped[list["MedicalAssignmentUpdate"]] = relationship(
        back_populates="assignment",
        cascade="all, delete-orphan",
        order_by="MedicalAssignmentUpdate.created_at.desc()",
    )

    work_assignment: Mapped["WorkAssignment | None"] = relationship(
        back_populates="medical_assignments",
    )
