import os

# Settings are constructed while importing the application.
os.environ.setdefault("DB_NAME", "test")
os.environ.setdefault("DB_PASSWORD", "test")
os.environ.setdefault("DB_HOST", "localhost")
os.environ.setdefault("DB_USER", "test")
os.environ.setdefault("JWT_SECRET_KEY", "test-secret-key")
os.environ.setdefault("REFRESH_TOKEN_EXPIRE_DAYS", "30")

import pytest
from app.main import app
from fastapi.testclient import TestClient


@pytest.fixture
def client():
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture
def user_factory():
    def build(user_id=1, role="user"):
        from types import SimpleNamespace

        return SimpleNamespace(
            id=user_id,
            email=f"user{user_id}@example.com",
            username=f"user{user_id}",
            role=role,
        )

    return build
