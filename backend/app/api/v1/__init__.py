from app.api.v1.auth import auth_router
from app.api.v1.dogs import dog_router
from fastapi import APIRouter

router_v1 = APIRouter()
router_v1.include_router(auth_router)
router_v1.include_router(dog_router)

__all__ = ["auth_router", "dog_router", "router_v1"]
