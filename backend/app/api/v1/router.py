from app.api.v1.assignment import assignment_router
from app.api.v1.assignment_updates import assignment_update_router
from app.api.v1.auth import auth_router
from app.api.v1.clinic import clinic_router
from app.api.v1.dogs import dog_router
from app.api.v1.reports import reports_router
from app.api.v1.medical_assignment import medical_assignment_router
from app.api.v1.volunteer import volunteer_router
from fastapi import APIRouter

router = APIRouter(prefix="/api/v1")

router.include_router(auth_router)
router.include_router(clinic_router)
router.include_router(volunteer_router)
router.include_router(dog_router)
router.include_router(reports_router)
router.include_router(assignment_router)
router.include_router(assignment_update_router)
router.include_router(medical_assignment_router)
