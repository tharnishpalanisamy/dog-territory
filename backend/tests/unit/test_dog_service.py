from types import SimpleNamespace
from unittest.mock import AsyncMock

import pytest

from app.exceptions import DogNotFoundException
from app.schemas import DogFilterParams, DogUpdate
from app.services.implementation.dog_service import DogService


@pytest.fixture
def dog_service():
    db = SimpleNamespace(commit=AsyncMock())
    repository = SimpleNamespace(
        get_max_count=AsyncMock(return_value=4),
        create=AsyncMock(),
        get_all=AsyncMock(return_value=[]),
        get_by_id=AsyncMock(return_value=None),
        get_by_dog_code=AsyncMock(return_value=None),
        update_by_id=AsyncMock(),
        update_by_dog_code=AsyncMock(),
        delete_by_id=AsyncMock(),
        delete_dog_code=AsyncMock(),
    )
    return DogService(db, repository), db, repository


@pytest.mark.asyncio
async def test_create_dog_assigns_next_pincode_code(dog_service, user_factory):
    service, db, repo = dog_service
    repo.create.side_effect = lambda dog: dog
    data = {
        "state": "State",
        "district": "District",
        "area_name": "Area",
        "pin_code": "560001",
        "latitude": 12.9,
        "longitude": 77.6,
        "vaccination_status": "unknown",
    }

    result = await service.create_dog(
        __import__("app.schemas", fromlist=["DogCreate"]).DogCreate(**data),
        user_factory(),
    )

    assert result.dog_code == "560001-5"
    assert result.dog_number == 5
    assert result.created_by == 1
    db.commit.assert_awaited_once()


@pytest.mark.asyncio
async def test_list_dogs_forwards_filters_and_pagination(dog_service):
    service, _, repo = dog_service
    filters = DogFilterParams(state="State")
    await service.get_all_dogs(filters, 10, 20)
    repo.get_all.assert_awaited_once_with(filters, 10, 20)


@pytest.mark.asyncio
async def test_missing_dog_lookups_raise_not_found(dog_service):
    service, _, _ = dog_service
    with pytest.raises(DogNotFoundException):
        await service.get_dog_by_id(42)
    with pytest.raises(DogNotFoundException):
        await service.get_dog_by_dog_code("560001-42")


@pytest.mark.asyncio
async def test_update_dog_commits_only_set_fields(dog_service):
    service, db, repo = dog_service
    dog = SimpleNamespace(id=1)
    repo.get_by_id.return_value = dog
    repo.update_by_id.return_value = dog
    await service.update_dog_by_id(1, DogUpdate(color="brown"))
    repo.update_by_id.assert_awaited_once_with(dog, {"color": "brown"})
    db.commit.assert_awaited_once()


@pytest.mark.asyncio
async def test_delete_by_id_delegates(dog_service):
    service, _, repo = dog_service
    await service.delete_dog_by_id(3)
    repo.delete_by_id.assert_awaited_once_with(3)
