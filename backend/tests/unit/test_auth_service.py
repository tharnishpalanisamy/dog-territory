from types import SimpleNamespace
from unittest.mock import AsyncMock, patch

import pytest

from app.exceptions import InvalidCredentialsException
from app.schemas import UserLogin
from app.services.implementation.auth_service import AuthService


@pytest.mark.asyncio
async def test_authenticate_returns_tokens_for_valid_credentials():
    user = SimpleNamespace(
        id=7, email="a@example.com", username="A", password_hash="hash"
    )
    repo = SimpleNamespace(get_by_email=AsyncMock(return_value=user))
    refresh = SimpleNamespace(issue_refresh_token=AsyncMock(return_value="refresh"))
    service = AuthService(SimpleNamespace(), repo, refresh)
    with (
        patch(
            "app.services.implementation.auth_service.verify_password",
            return_value=True,
        ),
        patch(
            "app.services.implementation.auth_service.create_access_token",
            return_value="access",
        ),
    ):
        result = await service.authenticate_user(
            UserLogin(email="a@example.com", password="pw")
        )
    assert result.access_token == "access"
    assert result.refresh_token == "refresh"
    assert result.user.id == 7


@pytest.mark.asyncio
async def test_authenticate_rejects_unknown_user():
    repo = SimpleNamespace(get_by_email=AsyncMock(return_value=None))
    service = AuthService(SimpleNamespace(), repo, SimpleNamespace())
    with pytest.raises(InvalidCredentialsException):
        await service.authenticate_user(UserLogin(email="a@example.com", password="pw"))


@pytest.mark.asyncio
async def test_signup_hashes_password_and_commits():
    from app.schemas import UserCreate

    db = SimpleNamespace(commit=AsyncMock())
    repo = SimpleNamespace(create=AsyncMock(side_effect=lambda user: user))
    service = AuthService(db, repo, SimpleNamespace())
    with patch(
        "app.services.implementation.auth_service.hash_password", return_value="hashed"
    ):
        user = await service.signup_user(
            UserCreate(email="a@example.com", username="A", password="pw")
        )
    assert user.password_hash == "hashed"
    db.commit.assert_awaited_once()
