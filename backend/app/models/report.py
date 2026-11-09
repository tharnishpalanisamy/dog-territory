from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, Enum, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core import ReportStatus
from app.database.base import Base

if TYPE_CHECKING:
    from app.models.report import Report
    from app.models.work_assignments import WorkAssignment


class Report(Base):
    __tablename__ = "reports"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    reporter_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    dog_id: Mapped[int | None] = mapped_column(ForeignKey("dogs.id"), nullable=True)
    report_type: Mapped[str] = mapped_column(String(50), nullable=False)
    description: Mapped[str | None] = mapped_column(String(255), nullable=True)
    state: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        default="Tamil Nadu",
    )
    district: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )
    pincode: Mapped[str] = mapped_column(String(10), nullable=False)
    area_name: Mapped[str] = mapped_column(String(100), nullable=False)
    location: Mapped[str] = mapped_column(Text, nullable=False)
    image_filename: Mapped[str | None] = mapped_column(String(255), nullable=True)
    image_path: Mapped[str | None] = mapped_column(String(500), nullable=True)

    status: Mapped[ReportStatus] = mapped_column(
        Enum(
            ReportStatus,
            name="report_status",
            values_callable=lambda enum_cls: [role.value for role in enum_cls],
        ),
        nullable=False,
        default="pending",
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
    updated_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        onupdate=func.now(),
        nullable=True,
    )

    work_assignments: Mapped[list["WorkAssignment"]] = relationship(
        back_populates="report",
        cascade="all, delete-orphan",
    )
