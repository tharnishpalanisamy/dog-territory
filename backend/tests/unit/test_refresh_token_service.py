from datetime import UTC, datetime, timedelta
from types import SimpleNamespace
from unittest.mock import AsyncMock

import pytest

from app.exceptions import InvalidRefreshTokenException
from app.services.implementation.refresh_token_service import RefreshTokenService


def make_service(record):
    db = SimpleNamespace(
        add=AsyncMock(), flush=AsyncMock(), commit=AsyncMock(), rollback=AsyncMock()
    )
    repo = SimpleNamespace(
        get_token_by_hash_for_update=AsyncMock(return_value=record),
        revoke_all=AsyncMock(),
        create=AsyncMock(),
    )
    return RefreshTokenService(db, repo), db, repo


@pytest.mark.asyncio
async def test_rotate_refresh_token_replaces_old_token():
    old = SimpleNamespace(
        user_id=3,
        expires_at=datetime.now(UTC) + timedelta(days=1),
        revoked_at=None,
        replaced_by_id=None,
    )
    service, db, repo = make_service(old)
    db.flush.side_effect = [None, None]
    db.add = lambda item: setattr(item, "id", 99)
    user_id, replacement = await service.rotate_refresh_token("old")
    assert user_id == 3
    assert replacement != "old"
    assert old.revoked_at is not None
    assert old.replaced_by_id == 99
    repo.get_token_by_hash_for_update.assert_awaited_once()
    db.commit.assert_awaited_once()


@pytest.mark.asyncio
async def test_reusing_revoked_refresh_token_revokes_user_tokens():
    old = SimpleNamespace(user_id=3, revoked_at=datetime.now(UTC))
    service, db, repo = make_service(old)
    with pytest.raises(InvalidRefreshTokenException):
        await service.rotate_refresh_token("old")
    repo.revoke_all.assert_awaited_once()
    db.commit.assert_awaited_once()


@pytest.mark.asyncio
async def test_expired_refresh_token_is_rejected_and_marked_revoked():
    old = SimpleNamespace(
        user_id=3,
        expires_at=datetime.now(UTC) - timedelta(seconds=1),
        revoked_at=None,
    )
    service, db, _ = make_service(old)
    with pytest.raises(InvalidRefreshTokenException):
        await service.rotate_refresh_token("old")
    assert old.revoked_at is not None
    db.commit.assert_awaited_once()
