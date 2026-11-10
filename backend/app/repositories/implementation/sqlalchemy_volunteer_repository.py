from sqlalchemy import select

from app.models import Volunteer


class VolunteerRepository:
    def __init__(self, db):
        self.db = db

    async def get_by_id(self, id: int) -> Volunteer | None :
        query = select(Volunteer).where(Volunteer.assigned_to == id)

        result = await self.db.scalars(query)
        return result.all()
