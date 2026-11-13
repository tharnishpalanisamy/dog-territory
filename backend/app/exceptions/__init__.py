from .dog import DogNotFoundException
from .refresh_token import InvalidRefreshTokenException
from .report import ReportNotFoundException
from .user_exceptions import (
    EmailAlreadyExists,
    InvalidCredentialsException,
    NotAuthorizedException,
    UserNotFoundException,
)
from .volunteer import (
    VolunteerAlreadyExistsException,
    VolunteerNotFoundException,
    VolunteerServiceNotAvailable,
)
from .work_assignment import (
    AssignmentAlreadyClaimedException,
    AssignmentNotFoundException,
    AssignmentUpdateNotFoundException,
    ClinicInUseException,
    ClinicNotFoundException,
)

__all__ = [
    "AssignmentAlreadyClaimedException",
    "AssignmentNotFoundException",
    "AssignmentUpdateNotFoundException",
    "ClinicInUseException",
    "ClinicNotFoundException",
    "DogNotFoundException",
    "EmailAlreadyExists",
    "InvalidCredentialsException",
    "InvalidRefreshTokenException",
    "NotAuthorizedException",
    "ReportNotFoundException",
    "UserNotFoundException",
    "VolunteerAlreadyExistsException",
    "VolunteerNotFoundException",
    "VolunteerServiceNotAvailable",
]
