from app.models import VeterinaryRecord


class VeterinaryRecordService:
    def __init__(self, db, repository):
        self.db = db
        self.repository = repository

    async def create_veterinary_record(self, data, user):
        veterinary_record = VeterinaryRecord(**data.model_dump())

        try:
            result = await self.repository.create(veterinary_record)
            await self.db.commit()

            return result
        except Exception:
            await self.db.rollback()
            raise
