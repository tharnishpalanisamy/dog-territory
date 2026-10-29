from datetime import datetime
from typing import Protocol

from app.models import RefreshToken


class RefreshTokenRepositoryProtocol(Protocol):
    async def create(self, token: RefreshToken) -> RefreshToken: ...

    async def get_token_by_hash_for_update(self, hash: str) -> RefreshToken: ...

    async def get_token_by_hash(self, hash: str) -> RefreshToken: ...

    async def revoke(
        self, token: RefreshToken, revoked_at: datetime
    ) -> RefreshToken: ...

    async def revoke_all(self, user_id: int) -> None: ...
