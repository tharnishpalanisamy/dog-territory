from .auth_service_protocol import AuthServiceProtocol
from .clinic_service_protocol import ClinicServiceProtocol
from .dog_service_protocol import DogServiceProtocol
from .medical_assignment_service_protocol import MedicalAssignmentServiceProtocol
from .medical_assignment_update_service_protocol import (
    MedicalAssignmentUpdateServiceProtocol,
)
from .refresh_token_service_protocol import RefreshTokenServiceProtocol
from .reports_service_protocol import ReportsServiceProtocol
from .volunteer_service_protocol import VolunteerServiceProtocol
from .veterinarian_service_protocol import VeterinarianServiceProtocol
from .work_assignment_service_protocol import WorkAssignmentServiceProtocol
from .work_assignment_update_service_protocol import WorkAssignmentUpdateServiceProtocol

__all__ = [
    "AuthServiceProtocol",
    "ClinicServiceProtocol",
    "DogServiceProtocol",
    "MedicalAssignmentServiceProtocol",
    "MedicalAssignmentUpdateServiceProtocol",
    "RefreshTokenServiceProtocol",
    "ReportsServiceProtocol",
    "VolunteerServiceProtocol",
    "VeterinarianServiceProtocol",
    "WorkAssignmentServiceProtocol",
    "WorkAssignmentUpdateServiceProtocol",
]
