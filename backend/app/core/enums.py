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
    REGISTRATION = "registration"
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


class AssignmentUpdateType(str, enum.Enum):
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



class VeterinarianApprovalStatus(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    SUSPENDED = "suspended"


class MedicalAssignmentMode(str, enum.Enum):
    CLINIC = "clinic"
    FIELD = "field"


class MedicalAssignmentStatus(str, enum.Enum):
    OPEN = "open"
    CLAIMED = "claimed"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class MedicalAssignmentUpdateType(str, enum.Enum):
    NOTE = "note"
    DIAGNOSIS = "diagnosis"
    TREATMENT = "treatment"
    PROGRESS = "progress"
    READY_FOR_RELEASE = "ready_for_release"
    FOLLOW_UP = "follow_up"


    