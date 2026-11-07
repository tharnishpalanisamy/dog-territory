from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import (
    DateTime,
    ForeignKey,
    Integer,
    Text,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base

if TYPE_CHECKING:
    from app.models.dog import Dog
    from app.models.user import User
    from app.models.work_assignments import WorkAssignment


class VeterinaryRecord(Base):
    __tablename__ = "veterinary_records"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    dog_id: Mapped[int] = mapped_column(
        ForeignKey("dogs.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    veterinarian_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )

    assignment_id: Mapped[int | None] = mapped_column(
        ForeignKey("work_assignments.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    diagnosis: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    treatment: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    medication: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    notes: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    examined_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    # Relationships

    dog: Mapped["Dog"] = relationship()

    veterinarian: Mapped["User"] = relationship()

    assignment: Mapped["WorkAssignment | None"] = relationship()
