from types import SimpleNamespace
from unittest.mock import AsyncMock

import pytest

from app.core import UserRole
from app.exceptions import (
    UserNotFoundException,
    VolunteerAlreadyExistsException,
    VolunteerNotFoundException,
)
from app.schemas import VolunteerCreate, VolunteerUpdate
from app.services.implementation.volunteer_service import VolunteerService


def make_service(*, user=None, volunteer=None):
    db = SimpleNamespace(commit=AsyncMock(), rollback=AsyncMock())
    users = SimpleNamespace(get_by_id=AsyncMock(return_value=user))
    volunteers = SimpleNamespace(
        get_by_user_id=AsyncMock(return_value=volunteer),
        create=AsyncMock(side_effect=lambda value: value),
        update=AsyncMock(),
        get_by_id=AsyncMock(return_value=volunteer),
        get_all=AsyncMock(return_value=[]),
        delete=AsyncMock(),
    )
    return VolunteerService(db, volunteers, users), db, volunteers, users


def volunteer_data():
    return VolunteerCreate(
        phone_number="9876543210",
        state="Karnataka",
        district="Bengaluru",
        area_name="Indiranagar",
        pincode="560001",
        service_pincodes=["560001"],
    )


@pytest.mark.asyncio
async def test_create_profile_sets_role_and_commits():
    user = SimpleNamespace(id=4, role=UserRole.USER)
    service, db, repo, _ = make_service(user=user)
    result = await service.create_profile(4, volunteer_data())
    assert result.user_id == 4
    assert user.role == UserRole.VOLUNTEER
    repo.create.assert_awaited_once()
    db.commit.assert_awaited_once()


@pytest.mark.asyncio
async def test_create_profile_rejects_missing_user():
    service, _, repo, _ = make_service()
    with pytest.raises(UserNotFoundException):
        await service.create_profile(4, volunteer_data())
    repo.create.assert_not_awaited()


@pytest.mark.asyncio
async def test_create_profile_rejects_duplicate_profile():
    service, _, repo, _ = make_service(
        user=SimpleNamespace(id=4), volunteer=SimpleNamespace(id=10)
    )
    with pytest.raises(VolunteerAlreadyExistsException):
        await service.create_profile(4, volunteer_data())
    repo.create.assert_not_awaited()


@pytest.mark.asyncio
async def test_update_profile_sends_only_provided_fields_and_commits():
    volunteer = SimpleNamespace(id=2)
    service, db, repo, _ = make_service(volunteer=volunteer)
    await service.update_profile(4, VolunteerUpdate(phone_number="9876543211"))
    repo.update.assert_awaited_once_with(volunteer, {"phone_number": "9876543211"})
    db.commit.assert_awaited_once()


@pytest.mark.asyncio
async def test_get_profile_raises_when_missing():
    service, _, _, _ = make_service()
    with pytest.raises(VolunteerNotFoundException):
        await service.get_by_user_id(4)
