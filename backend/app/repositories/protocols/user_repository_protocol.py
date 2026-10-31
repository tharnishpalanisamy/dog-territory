from typing import Protocol

from app.models import User


class UserProtocol(Protocol):
    async def create(self, user: User) -> User: ...

    async def get_by_id(self, user_id: int) -> User | None: ...

    async def get_by_email(self, email: str) -> User | None: ...
