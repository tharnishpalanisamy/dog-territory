from typing import Protocol

from app.models import User
from app.schemas import UserLocationUpdate, UserPhoneNumberUpdate, UserProfileUpdate


class UserServiceProtocol(Protocol):
    async def update_user_location(
        self, user: User, location_data: UserLocationUpdate
    ): ...

    async def update_user_phone(
        self, user: User, phone_data: UserPhoneNumberUpdate
    ): ...

    async def update_user_profile(
        self, user: User, profile_data: UserProfileUpdate
    ): ...
