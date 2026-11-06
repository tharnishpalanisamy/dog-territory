from fastapi import APIRouter , status , Depends 
from app.dependencies import require_roles 

router = APIRouter(
    prefix='/reports' , tags=['Reports'] 
)

@router.post('/create') 
async def create_report():
    pass 