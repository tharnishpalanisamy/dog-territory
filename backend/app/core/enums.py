import enum


class UserRole(str, enum.Enum):
    ADMIN = "admin"
    VOLUNTEER = "volunteer"
    USER = "user"
    VETERINARIAN = "veterinarian"


class DogReportType(str, enum.Enum) :
    AGGRESSIVE = 'aggessive' 
    SICK = 'sick' 
    INJURED = 'injured' 
    UNCOLLARED = 'uncollared' 

