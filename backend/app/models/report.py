from app.database.base import Base
from sqlalchemy.orm import Mapped , mapped_column
from sqlalchemy import String , Integer , Float , ForeignKey , DateTime , func
from datetime import datetime

class Report(Base) :
    __tablename__ = 'reports' 
    id : Mapped[int] = mapped_column(
        Integer , primary_key=True  
        )
    reporter_id : Mapped[int] = mapped_column(
        ForeignKey('users.id') , nullable=False  
        )
    dog_id : Mapped[int | None] = mapped_column(
        ForeignKey('dogs.id') , nullable=True  
        )
    report_type : Mapped[str] = mapped_column(
        String(50) , nullable=False  
        )
    description : Mapped[str | None] = mapped_column(
        String(255) , nullable=True  
        )
    latitude : Mapped[float] = mapped_column(
        Float , nullable=False  
        )
    longitude : Mapped[float] = mapped_column(
        Float , nullable=False  
        )
    status : Mapped[str] = mapped_column(String(20) , nullable=False , default='pending'  )
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