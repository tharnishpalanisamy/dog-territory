from .auth_service_protocol import AuthServiceProtocol
from .clinic_service_protocol import ClinicServiceProtocol
from .dashboard_service_protocol import DashboardServiceProtocol
from .dog_service_protocol import DogServiceProtocol
from .medical_assignment_service_protocol import MedicalAssignmentServiceProtocol
from .medical_assignment_update_service_protocol import (
    MedicalAssignmentUpdateServiceProtocol,
)
from .password_reset_service_protocol import PasswordResetServiceProtocol
from .public_service_protocol import PublicServiceProtocol
from .refresh_token_service_protocol import RefreshTokenServiceProtocol
from .reports_service_protocol import ReportsServiceProtocol
from .veterinarian_service_protocol import VeterinarianServiceProtocol
from .veterinary_record_service_protocol import VeterinaryRecordServiceProtocol
from .volunteer_service_protocol import VolunteerServiceProtocol
from .work_assignment_service_protocol import WorkAssignmentServiceProtocol
from .work_assignment_update_service_protocol import WorkAssignmentUpdateServiceProtocol

__all__ = [
    "AuthServiceProtocol",
    "ClinicServiceProtocol",
    "DashboardServiceProtocol",
    "DogServiceProtocol",
    "MedicalAssignmentServiceProtocol",
    "MedicalAssignmentUpdateServiceProtocol",
    "PasswordResetServiceProtocol",
    "PublicServiceProtocol",
    "RefreshTokenServiceProtocol",
    "ReportsServiceProtocol",
    "VeterinarianServiceProtocol",
    "VeterinaryRecordServiceProtocol",
    "VolunteerServiceProtocol",
    "WorkAssignmentServiceProtocol",
    "WorkAssignmentUpdateServiceProtocol",
]
