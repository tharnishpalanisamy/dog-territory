from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import (
    ARRAY,
    DateTime,
    Enum,
    ForeignKey,
    Integer,
    String,
    func,
    text,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core import VolunteerApprovalStatus, VolunteerAvailability
from app.database.base import Base

if TYPE_CHECKING:
    from app.models.user import User


class Volunteer(Base):
    __tablename__ = "volunteers"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        unique=True,
        nullable=False,
    )

    phone_number: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
    )

    state: Mapped[str] = mapped_column(String(100), nullable=False)
    district: Mapped[str] = mapped_column(String(100), nullable=False)
    area_name: Mapped[str] = mapped_column(String(150), nullable=False)
    pincode: Mapped[str] = mapped_column(String(10), nullable=False)

    availability: Mapped[VolunteerAvailability] = mapped_column(
        Enum(
            VolunteerAvailability,
            name="Volunteer_availability_enum",
            values_callable=lambda enum: [e.value for e in enum],
        ),
        nullable=False,
        default=VolunteerAvailability.WEEKENDS,
    )

    service_pincodes: Mapped[list[str]] = mapped_column(
        ARRAY(String(10)),
        nullable=False,
        default=list,
        server_default=text("ARRAY[]::varchar[]"),
    )

    approval_status: Mapped[VolunteerApprovalStatus] = mapped_column(
        Enum(
            VolunteerApprovalStatus,
            name="volunteer_approval_enum",
            values_callable=lambda enum_cls: [e.value for e in enum_cls],
        ),
        nullable=False,
        default=VolunteerApprovalStatus.PENDING,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    user: Mapped["User"] = relationship(
        back_populates="volunteer_profile",
        foreign_keys=[user_id],
    )
