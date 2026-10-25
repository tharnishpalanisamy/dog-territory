from app.database.connection import get_db 
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Depends
from app.repositories.implementation import UserRepository
from app.repositories.protocols import UserProtocol
from app.services import AuthService

def get_user_repository(db:AsyncSession = Depends(get_db)):
    return UserRepository(db)

def get_auth_service(db:AsyncSession = Depends(get_db) , repository:UserProtocol = Depends(get_user_repository)) :
    return AuthService(db , repository)