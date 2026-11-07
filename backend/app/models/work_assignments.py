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

from app.core import AssignmentPriority, AssignmentStatus, AssignmentType
from app.database.base import Base

if TYPE_CHECKING:
    from app.models.assignment_update import AssignmentUpdate
    from app.models.dog import Dog
    from app.models.report import Report
    from app.models.user import User
    from app.models.work_assignments import WorkAssignment


class WorkAssignment(Base):
    __tablename__ = "work_assignments"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    report_id: Mapped[int] = mapped_column(
        ForeignKey("reports.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    dog_id: Mapped[int | None] = mapped_column(
        ForeignKey("dogs.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    title: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    task_type: Mapped[AssignmentType] = mapped_column(
        Enum(
            AssignmentType,
            name="assignment_type_enum",
            native_enum=True,
            values_callable=lambda enum: [e.value for e in enum],
        ),
        nullable=False,
    )

    priority: Mapped[AssignmentPriority] = mapped_column(
        Enum(
            AssignmentPriority,
            name="assignment_priority_enum",
            native_enum=True,
            values_callable=lambda enum: [e.value for e in enum],
        ),
        default=AssignmentPriority.NORMAL,
        nullable=False,
    )

    status: Mapped[AssignmentStatus] = mapped_column(
        Enum(
            AssignmentStatus,
            name="assignment_status_enum",
            native_enum=True,
            values_callable=lambda enum: [e.value for e in enum],
        ),
        default=AssignmentStatus.OPEN,
        nullable=False,
        index=True,
    )

    assigned_to: Mapped[int | None] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    assigned_by: Mapped[int | None] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    accepted_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    completed_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    # Relationships

    updates: Mapped[list["AssignmentUpdate"]] = relationship(
        back_populates="assignment",
        cascade="all, delete-orphan",
        order_by="AssignmentUpdate.created_at.desc()",
    )

    report: Mapped["Report"] = relationship(
        back_populates="work_assignments",
    )

    dog: Mapped["Dog | None"] = relationship()

    assignee: Mapped["User | None"] = relationship(
        foreign_keys=[assigned_to],
    )

    assigner: Mapped["User | None"] = relationship(
        foreign_keys=[assigned_by],
    )
