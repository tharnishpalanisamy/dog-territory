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
    RESCUE = "rescue"
    TRANSPORT = "transport"
    VACCINATION = "vaccination"
    STERILIZATION = "sterilization"
    MEDICAL_CARE = "medical_care"
    FEEDING = "feeding"
    OTHER = "other"


class AssignmentPriority(str, enum.Enum):
    LOW = "low"
    NORMAL = "normal"
    HIGH = "high"
    URGENT = "urgent"


class AssignmentStatus(str, enum.Enum):
    OPEN = "open"
    ACCEPTED = "accepted"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class AssignmentUpdateType(str , enum.Enum):
    PROGRESS = "progress"
    NOTE = "note"
    ISSUE = "issue"
    LOCATION = "location"


class VolunteerAvailability(str, enum.Enum):
    WEEKDAYS = "weekdays"
    WEEKENDS = "weekends"
    EVERYDAY = "everyday"
    FLEXIBLE = "flexible"
    UNAVAILABLE = "unavailable"
