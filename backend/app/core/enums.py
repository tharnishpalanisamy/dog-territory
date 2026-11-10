import enum


class UserRole(str, enum.Enum):
    ADMIN = "admin"
    VOLUNTEER = "volunteer"
    USER = "user"
    VETERINARIAN = "veterinarian"


class DogReportType(str, enum.Enum):
    AGGRESSIVE = "aggessive"
    SICK = "sick"
    INJURED = "injured"
    UNCOLLARED = "uncollared"


class ReportStatus(str, enum.Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    RESOLVED = "resolved"
    REJECTED = "rejected"


class AssignmentType(str, enum.Enum):
    RESCUE = "RESCUE"
    TRANSPORT = "TRANSPORT"
    VACCINATION = "VACCINATION"
    STERILIZATION = "STERILIZATION"
    MEDICAL_CARE = "MEDICAL_CARE"
    FEEDING = "FEEDING"
    OTHER = "OTHER"


class AssignmentPriority(str, enum.Enum):
    LOW = "LOW"
    NORMAL = "NORMAL"
    HIGH = "HIGH"
    URGENT = "URGENT"


class AssignmentStatus(str, enum.Enum):
    OPEN = "OPEN"
    ACCEPTED = "ACCEPTED"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"


class AssignmentUpdateType(str , enum.Enum):
    PROGRESS = "PROGRESS"
    NOTE = "NOTE"
    ISSUE = "ISSUE"
    LOCATION = "LOCATION"


class VolunteerAvailability(str, enum.Enum):
    WEEKDAYS = "weekdays"
    WEEKENDS = "weekends"
    EVERYDAY = "everyday"
    FLEXIBLE = "flexible"
    UNAVAILABLE = "unavailable"