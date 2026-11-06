from typing import Protocol


class ReportsServiceProtocol(Protocol):
    async def create_report(): ...
