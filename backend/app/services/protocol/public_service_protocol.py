from typing import Protocol


class PublicServiceProtocol(Protocol):
    async def get_statistics(): ...
