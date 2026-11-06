from typing import Protocol


class ReportsRepositoryProtocol(Protocol):
    async def create(): ...
