from database.base import Base
from sqlalchemy.orm import Mapped , mapped_column
from sqlalchemy import String , Integer , Date , DateTime , func
from datetime import date , datetime


class User(Base) :
    __tablename__ = 'users' 

    id : Mapped[int] = mapped_column(Integer , primary_key=True , index=True ) 
    email : Mapped[str] = mapped_column(String(255)  ,nullable=False , unique=True , index = True  ) 
    username : Mapped[str] = mapped_column(String(100) , nullable=False ) 
    password_hash : Mapped[str] = mapped_column(String(255) , nullable=False ) 
    date_of_birth : Mapped[date] = mapped_column(Date , nullable=False )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
