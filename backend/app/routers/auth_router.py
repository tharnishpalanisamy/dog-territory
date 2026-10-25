from fastapi import APIRouter , Depends
from app.schemas.auth import UserLogin , UserCreate
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.connection import get_db
from app.services.auth_service import AuthService 
from app.dependencies import get_auth_service


router = APIRouter(
    prefix='/api/auth' 
)

@router.get('/me') 
async def get_user():
    pass 

@router.post('/login') 
async def login_user(login_data:UserLogin , service:AuthService = Depends(get_auth_service) ) :
    auth_services = service
    return await auth_services.authenticate_user(login_data) 

@router.post('/signup') 
async def signup_user(signup_data:UserCreate , service:AuthService = Depends(get_auth_service)) :
    auth_services = service
    return await auth_services.signup_user(signup_data)