from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, Integer, String, func
from sqlalchemy import Enum as SQLAlchemyEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core import UserRole
from app.database.base import Base

if TYPE_CHECKING:
    from app.models.medical_assignment import MedicalAssignment
    from app.models.veterinarian import Veterinarian


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    email: Mapped[str] = mapped_column(String(255), nullable=False, unique=True)
    username: Mapped[str] = mapped_column(String(100), nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[UserRole] = mapped_column(
        SQLAlchemyEnum(
            UserRole,
            name="userrole",
            values_callable=lambda enum_cls: [role.value for role in enum_cls],
        ),
        nullable=False,
        default=UserRole.USER,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    veterinarian_profile: Mapped["Veterinarian | None"] = relationship(
        foreign_keys="Veterinarian.user_id",
        uselist=False,
    )

    created_medical_assignments: Mapped[list["MedicalAssignment"]] = relationship(
        foreign_keys="MedicalAssignment.created_by",
    )

    volunteer_medical_assignments: Mapped[list["MedicalAssignment"]] = relationship(
        foreign_keys="MedicalAssignment.volunteer_id",
    )
