from .clinic_repository_protocol import ClinicRepositoryProtocol
from .dog_repository_protocol import DogRepositoryProtocol
from .medical_assignment_repository_protocol import MedicalAssignmentRepositoryProtocol
from .medical_assignment_update_repository_protocol import (
    MedicalAssignmentUpdateRepositoryProtocol,
)
from .refresh_token_protocol import RefreshTokenRepositoryProtocol
from .reports_repository_protocol import ReportsRepositoryProtocol
from .user_repository_protocol import UserRepositoryProtocol
from .volunteer_repository_protocol import VolunteerRepositoryProtocol
from .work_assignment_repository_protocol import WorkAssignmentRepositoryProtocol
from .work_assignment_update_repository_protocol import (
    WorkAssignmentUpdateRepositoryProtocol,
)

__all__ = [
    "ClinicRepositoryProtocol",
    "DogRepositoryProtocol",
    "MedicalAssignmentRepositoryProtocol",
    "MedicalAssignmentUpdateRepositoryProtocol",
    "RefreshTokenRepositoryProtocol",
    "ReportsRepositoryProtocol",
    "UserRepositoryProtocol",
    "VolunteerRepositoryProtocol",
    "WorkAssignmentRepositoryProtocol",
    "WorkAssignmentUpdateRepositoryProtocol",
]
