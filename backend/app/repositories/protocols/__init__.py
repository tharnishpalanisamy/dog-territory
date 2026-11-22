from .clinic_repository_protocol import ClinicRepositoryProtocol
from .dashboard_repository_protocol import DashboardRepositoryProtocol
from .dog_repository_protocol import DogRepositoryProtocol
from .medical_assignment_repository_protocol import MedicalAssignmentRepositoryProtocol
from .medical_assignment_update_repository_protocol import (
    MedicalAssignmentUpdateRepositoryProtocol,
)
from .password_reset_repository_protocol import PasswordResetRepositoryProtocol
from .refresh_token_protocol import RefreshTokenRepositoryProtocol
from .reports_repository_protocol import ReportsRepositoryProtocol
from .user_repository_protocol import UserRepositoryProtocol
from .veterinarian_repository_protocol import VeterinarianRepositoryProtocol
from .veterinary_record_repository_protocol import VeterinaryRecordRepositoryProtocol
from .volunteer_repository_protocol import VolunteerRepositoryProtocol
from .work_assignment_repository_protocol import WorkAssignmentRepositoryProtocol
from .work_assignment_update_repository_protocol import (
    WorkAssignmentUpdateRepositoryProtocol,
)

__all__ = [
    "ClinicRepositoryProtocol",
    "DashboardRepositoryProtocol",
    "DogRepositoryProtocol",
    "MedicalAssignmentRepositoryProtocol",
    "MedicalAssignmentUpdateRepositoryProtocol",
    "PasswordResetRepositoryProtocol",
    "RefreshTokenRepositoryProtocol",
    "ReportsRepositoryProtocol",
    "UserRepositoryProtocol",
    "VeterinarianRepositoryProtocol",
    "VeterinaryRecordRepositoryProtocol",
    "VolunteerRepositoryProtocol",
    "WorkAssignmentRepositoryProtocol",
    "WorkAssignmentUpdateRepositoryProtocol",
]
