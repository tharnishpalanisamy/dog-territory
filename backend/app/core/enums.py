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
