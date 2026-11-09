from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class Volunteer(Base):
    __tablename__ = "volunteers"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"), unique=True, nullable=False
    )

    phone_number: Mapped[str] = mapped_column(
        String(20), nullable=False
    )

    state: Mapped[str] = mapped_column(String(100), nullable=False)
    district: Mapped[str] = mapped_column(String(100), nullable=False)
    area_name: Mapped[str] = mapped_column(String(150), nullable=False)
    pincode: Mapped[str] = mapped_column(String(10), nullable=False)

    availability: Mapped[str | None] = mapped_column(
        String(255), nullable=True
    )

    approval_status: Mapped[str] = mapped_column(
        String(20), nullable=False, default="pending"
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )