from types import SimpleNamespace
from unittest.mock import AsyncMock

import pytest
from app.exceptions import DogNotFoundException, ReportNotFoundException
from app.schemas import ReportCreate
from app.services.implementation.reports_service import ReportsService


@pytest.mark.asyncio
async def test_create_report_links_known_dog_and_commits():
    user = SimpleNamespace(id=2)
    db = SimpleNamespace(commit=AsyncMock(), rollback=AsyncMock())
    report_repo = SimpleNamespace(create=AsyncMock(side_effect=lambda report: report))
    dog_repo = SimpleNamespace(
        get_by_dog_code=AsyncMock(return_value=SimpleNamespace(id=9))
    )
    service = ReportsService(db, report_repo, dog_repo)
    result = await service.create_report(
        user,
        ReportCreate(
            report_type="sick",
            description="hurt",
            pincode="560001",
            location="Park",
            dog_code="560001-1",
        ),
        None,
    )
    assert result.reporter_id == 2
    assert result.dog_id == 9
    db.commit.assert_awaited_once()


@pytest.mark.asyncio
async def test_create_report_rejects_unknown_dog():
    db = SimpleNamespace(commit=AsyncMock(), rollback=AsyncMock())
    dog_repo = SimpleNamespace(get_by_dog_code=AsyncMock(return_value=None))
    service = ReportsService(db, SimpleNamespace(), dog_repo)
    with pytest.raises(DogNotFoundException):
        await service.create_report(
            SimpleNamespace(id=2),
            ReportCreate(
                report_type="sick",
                pincode="560001",
                location="Park",
                dog_code="missing",
            ),
            None,
        )


@pytest.mark.asyncio
async def test_missing_report_raises_not_found():
    repo = SimpleNamespace(get_by_id=AsyncMock(return_value=None))
    service = ReportsService(SimpleNamespace(), repo, SimpleNamespace())
    with pytest.raises(ReportNotFoundException):
        await service.get_report_by_id(99)
