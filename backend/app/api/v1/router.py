from app.api.v1.auth import auth_router
from app.api.v1.dogs import dog_router
from fastapi import APIRouter

router = APIRouter(prefix="/api/v1")

router.include_router(auth_router)
router.include_router(dog_router)
