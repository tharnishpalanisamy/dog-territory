from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.protocols import (
    DogRepositoryProtocol,
    ReportsRepositoryProtocol,
    VolunteerRepositoryProtocol,
)


class PublicService:
    def __init__(
        self,
        db: AsyncSession,
        dog_repository: DogRepositoryProtocol,
        volunteer_repository: VolunteerRepositoryProtocol,
        reports_repository: ReportsRepositoryProtocol,
    ):
        self.dog_repository = dog_repository
        self.volunteer_repository = volunteer_repository
        self.reports_repository = reports_repository

    async def get_statistics(self):
        dog_count = await self.dog_repository.get_dogs_count()
        volunteer_count = await self.volunteer_repository.get_total_volunteer()
        reports_count = await self.reports_repository.get_total_reports()
        resolved_count = await self.reports_repository.get_total_resolved_reports()

        return {
            "dogs_count": dog_count,
            "volunteers_count": volunteer_count,
            "reports_count": reports_count,
            "resolved_count": resolved_count,
        }

    async def get_dog(self):
        dogs = await self.dog_repository.get_all(filters=None, limit=1, offset=0)
        if not dogs:
            return None

        dog = dogs[0]

        return {
            "dog_code": dog.dog_code,
            "area": dog.area_name,
            "status": dog.vaccination_status,
            "tags": ["street dog", "sample record"],
            "image": dog.images[0].image_url if dog.images else None,
        }
