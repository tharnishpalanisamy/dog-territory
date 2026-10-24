from database.base import Base
from sqlalchemy.orm import Mapped, mapped_column 
from sqlalchemy import (
    Integer , String , Boolean , Numeric , ForeignKey , DateTime, func
)
from datetime import datetime
from decimal import Decimal


class Dog(Base):
    __tablename__ = 'dogs'
    id:Mapped[int] = mapped_column(
        Integer , primary_key=True 
    )
    dog_code : Mapped[str] = mapped_column(
        String(20) ,nullable=False ,index = True , unique=True 
    ) 
    breed : Mapped[str|None] = mapped_column(
        String(100) , nullable=True
    )
    estimated_age : Mapped[int | None] = mapped_column(
        Integer , nullable=True 
    )
    color : Mapped[str|None] = mapped_column(
        String(50) , nullable=True 
    )
    description:Mapped[str|None] = mapped_column(
        String(255) , nullable=True 
    )
    is_sterilized:Mapped[bool|None] = mapped_column(
        Boolean , nullable=True 
    )
    status : Mapped[str] = mapped_column(
        String(20) , nullable=False , default='active' 
    )
    state : Mapped[str] = mapped_column(
        String(50) , nullable=False 
    )
    district : Mapped[str] = mapped_column(
        String(50) , nullable=False 
    )
    area_code:Mapped[int] = mapped_column(
        Integer , nullable=False
    )
    latitude : Mapped[Decimal] = mapped_column(
        Numeric(10,7) , nullable=False 
    )
    longitude : Mapped[Decimal] = mapped_column(
        Numeric(10,7) , nullable=False 
    ) 
    vaccination_status : Mapped[str] = mapped_column(
        String(20) , nullable=False 
    )
    vaccination_date:Mapped[datetime | None] = mapped_column(
        DateTime , nullable=True 
    )
    booster_dose_date : Mapped[datetime | None] = mapped_column(
        DateTime , nullable=True 
    )
    created_by : Mapped[int] = mapped_column(
        ForeignKey('users.id')
    )
    created_at : Mapped[datetime] = mapped_column(
        DateTime(timezone = True) , nullable=False , server_default=func.now() 
    )
    updated_at : Mapped[datetime | None] = mapped_column(
        DateTime(timezone = True) , nullable=True , onupdate=func.now()
    )

