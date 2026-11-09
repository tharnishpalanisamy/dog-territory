from .auth_dependency import (
    admin_required,
    get_auth_service,
    get_current_user,
    require_roles,
)
from .dog_dependency import get_dog_service
from .reports_dependency import get_reports_service
from .volunteers_dependency import get_volunteer_repository, get_volunteers_service
from .work_assignment_dependency import get_work_assignment_service

__all__ = [
    "admin_required",
    "get_auth_service",
    "get_current_user",
    "get_dog_service",
    "get_reports_service",
    "get_volunteer_repository",
    "get_volunteers_service",
    "get_work_assignment_service",
    "require_roles",
]
