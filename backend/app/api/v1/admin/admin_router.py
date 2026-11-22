from fastapi import APIRouter

router = APIRouter(prefix="/admin", tags=["Admin"])

__all__ = ["router"]
