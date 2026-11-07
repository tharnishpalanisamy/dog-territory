from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import (
    DateTime,
    Enum,
    ForeignKey,
    Integer,
    Text,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core import AssignmentUpdateType
from app.database.base import Base

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.work_assignments import WorkAssignment


class AssignmentUpdate(Base):
    __tablename__ = "assignment_updates"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    assignment_id: Mapped[int] = mapped_column(
        ForeignKey("work_assignments.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    updated_by: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )

    update_type: Mapped[AssignmentUpdateType] = mapped_column(
        Enum(
            AssignmentUpdateType,
            name="assignment_update_type_enum",
            native_enum=True,
            values_callable=lambda enum: [e.value for e in enum],
        ),
        nullable=False,
    )

    description: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    # Relationships

    assignment: Mapped["WorkAssignment"] = relationship(
        back_populates="updates",
    )

    user: Mapped["User"] = relationship()
