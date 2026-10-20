from fastapi import APIRouter , Depends
from schemas.auth import UserLogin , UserCreate
from sqlalchemy.ext.asyncio import AsyncSession
from database.connection import get_db
from services.auth_service import AuthService


router = APIRouter(
    prefix='/api/auth' 
)

@router.get('/me') 
async def get_user():
    pass 

@router.post('/login') 
async def login_user(login_data:UserLogin , db:AsyncSession = Depends(get_db) ) :
    auth_services = AuthService(db) 
    return await auth_services.authenticate_user(login_data) 

@router.post('/signup') 
async def signup_user(signup_data:UserCreate , db:AsyncSession = Depends(get_db) ) :
    auth_services = AuthService(db) 

    return await auth_services.signup_user(signup_data)