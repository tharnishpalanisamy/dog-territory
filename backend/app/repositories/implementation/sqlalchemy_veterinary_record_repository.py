from app.models import VeterinaryRecord


class VeterinaryRecordRepository:
    def __init__(self, db):
        self.db = db

    async def create(self, veterinary_record: VeterinaryRecord) -> VeterinaryRecord:
        self.db.add(veterinary_record)
        await self.db.flush()
        await self.db.refresh(veterinary_record)

        return veterinary_record
