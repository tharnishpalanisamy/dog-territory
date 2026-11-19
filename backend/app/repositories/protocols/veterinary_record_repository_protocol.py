from typing import Protocol

from app.models import VeterinaryRecord


class VeterinaryRecordRepositoryProtocol(Protocol):
    async def create(self, veterinary_record: VeterinaryRecord) -> VeterinaryRecord: ...
