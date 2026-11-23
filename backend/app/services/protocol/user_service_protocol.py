from typing import Protocol

from app.models import User
from app.schemas import UserLocationUpdate


class UserServiceProtocol(Protocol):
    async def update_user_location(
        self, user: User, location_data: UserLocationUpdate
    ): ...
