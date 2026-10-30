from .auth_dependency import (
    admin_required,
    get_auth_service,
    get_current_user,
    require_roles,
)
from .dog_dependency import get_dog_service

__all__ = [
    "admin_required",
    "get_auth_service",
    "get_current_user",
    "get_dog_service",
    "require_roles",
]
