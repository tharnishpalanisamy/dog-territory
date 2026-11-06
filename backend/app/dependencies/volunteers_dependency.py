from app.repositories.implementation import VolunteerRepository
from app.repositories.protocols import VolunteerRepositoryProtocol
from app.services.implementation import VolunteerService
from app.services.protocol import VolunteerServiceProtocol


def get_volunteer_repository() -> VolunteerRepositoryProtocol:
    return VolunteerRepository()


def get_volunteers_service() -> VolunteerServiceProtocol:
    return VolunteerService()
