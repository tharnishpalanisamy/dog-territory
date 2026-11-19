from typing import Protocol


class VeterinaryRecordServiceProtocol(Protocol):
    async def create_veterinary_record(self, data, user): ...
