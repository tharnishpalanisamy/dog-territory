from sqlalchemy.ext.asyncio import AsyncSession

from app.models import AssignmentUpdate


class AssignmentUpdateRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(
        self,
        assignment_update: AssignmentUpdate,
    ) -> AssignmentUpdate:
        self.db.add(assignment_update)
        await self.db.flush()
        await self.db.refresh(assignment_update)

        return assignment_update
