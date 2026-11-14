"""Shared fixtures for unit and database-backed API tests.

The test database is deliberately opt-in. No fixture creates or drops a
PostgreSQL database; ``TEST_DATABASE_URL`` must name an already provisioned
``dog_territory_test`` database.
"""

from __future__ import annotations

import os
from collections.abc import AsyncIterator, Iterator
from pathlib import Path

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from sqlalchemy import select
from sqlalchemy.engine import URL, make_url
from sqlalchemy.ext.asyncio import (
    AsyncConnection,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.pool import NullPool

# Preserve any explicitly configured development target before installing the
# inert settings used by the application's otherwise-unused global engine.
_CONFIGURED_DB_ENV = {
    key: os.environ.get(key)
    for key in ("DB_NAME", "DB_HOST", "DB_PORT")
}

# The application constructs its unused default engine during import. Give it
# inert test-only settings; integration requests replace get_db before use.
os.environ["DB_NAME"] = "dog_territory_unused"
os.environ["DB_PASSWORD"] = "unused"
os.environ["DB_HOST"] = "127.0.0.1"
os.environ["DB_USER"] = "unused"
os.environ["JWT_SECRET_KEY"] = "test-only-secret-key-for-tests-32-bytes"
os.environ["REFRESH_TOKEN_EXPIRE_DAYS"] = "30"


TEST_DATABASE_NAME = "dog_territory_test"


@pytest.fixture(autouse=True)
def reset_rate_limit_state():
    """Keep process-local limiter counters isolated between test cases."""
    from app.core import limiter

    limiter._storage.reset()
    yield
    limiter._storage.reset()


@pytest.fixture
def temp_upload_dir() -> Iterator[Path]:
    """Writable, automatically cleaned storage for integration upload tests."""
    directory = Path(__file__).parent / "_upload_tmp"
    directory.mkdir(exist_ok=True)
    for entry in directory.iterdir():
        if entry.is_file():
            entry.unlink()
    try:
        yield directory
    finally:
        for entry in directory.iterdir():
            if entry.is_file():
                entry.unlink()


def _test_database_url() -> URL:
    from dotenv import dotenv_values

    backend_env = dotenv_values(Path(__file__).resolve().parents[1] / ".env")
    raw_url = os.environ.get("TEST_DATABASE_URL") or backend_env.get(
        "TEST_DATABASE_URL"
    )
    if not raw_url:
        raise RuntimeError(
            "TEST_DATABASE_URL is required and must point to the pre-created "
            "dog_territory_test PostgreSQL database. Tests never fall back to DB_NAME."
        )
    try:
        url = make_url(raw_url)
    except Exception as exc:
        raise RuntimeError("TEST_DATABASE_URL is malformed") from exc

    if url.drivername not in {"postgresql+asyncpg", "postgresql"}:
        raise RuntimeError("TEST_DATABASE_URL must use PostgreSQL (asyncpg preferred)")
    if (
        not url.host
        or not url.username
        or (url.port is not None and not 1 <= url.port <= 65535)
    ):
        raise RuntimeError(
            "TEST_DATABASE_URL must include a PostgreSQL host and username, "
            "and any supplied port must be valid"
        )
    if url.database != TEST_DATABASE_NAME:
        raise RuntimeError(
            f"Refusing to run tests: TEST_DATABASE_URL database must be exactly "
            f"{TEST_DATABASE_NAME!r}, got {url.database!r}."
        )

    # Compare against development configuration without ever connecting to it.
    # Read the backend .env directly because the application gets inert DB_*
    # environment defaults below to prevent accidental use of its global engine.
    development_env = backend_env
    development_name = _CONFIGURED_DB_ENV["DB_NAME"] or development_env.get("DB_NAME")
    development_host = _CONFIGURED_DB_ENV["DB_HOST"] or development_env.get("DB_HOST")
    development_port = int(
        _CONFIGURED_DB_ENV["DB_PORT"] or development_env.get("DB_PORT") or 5432
    )
    if (
        development_name == url.database
        and development_host == url.host
        and development_port == (url.port or 5432)
    ):
        raise RuntimeError(
            "Refusing to run tests: TEST_DATABASE_URL resolves to the configured "
            "development database. Configure a separate dog_territory_test database."
        )

    return url.set(drivername="postgresql+asyncpg")


@pytest.fixture(scope="session")
def test_database_url() -> URL:
    return _test_database_url()


@pytest_asyncio.fixture(scope="session", loop_scope="session")
async def test_engine(test_database_url: URL):
    """Engine that can only be built after the strict URL safety validation."""
    engine = create_async_engine(
        test_database_url, pool_pre_ping=True, poolclass=NullPool
    )
    try:
        yield engine
    finally:
        await engine.dispose()


@pytest_asyncio.fixture(scope="session", loop_scope="session")
async def _create_test_schema(test_engine):
    # The connection can only target the validated dedicated database. This
    # creates tables within that database; it never creates/drops a database.
    import app.models  # noqa: F401
    from app.database.base import Base

    async with test_engine.begin() as connection:
        await connection.run_sync(Base.metadata.create_all)
    yield


@pytest_asyncio.fixture
async def db_connection(
    test_engine, _create_test_schema
) -> AsyncIterator[AsyncConnection]:
    """Outer transaction per test; application commits are isolated by savepoints."""
    async with test_engine.connect() as connection:
        transaction = await connection.begin()
        try:
            yield connection
        finally:
            if transaction.is_active:
                await transaction.rollback()


@pytest_asyncio.fixture
async def db_session(db_connection) -> AsyncIterator[AsyncSession]:
    session_factory = async_sessionmaker(
        bind=db_connection,
        class_=AsyncSession,
        expire_on_commit=False,
        join_transaction_mode="create_savepoint",
    )
    async with session_factory() as session:
        try:
            yield session
        finally:
            await session.close()


@pytest_asyncio.fixture
async def app_client(db_connection, _create_test_schema) -> AsyncIterator[AsyncClient]:
    """HTTPX client whose every get_db dependency uses the test transaction."""
    from app.database.connection import get_db
    from app.main import app

    session_factory = async_sessionmaker(
        bind=db_connection,
        class_=AsyncSession,
        expire_on_commit=False,
        join_transaction_mode="create_savepoint",
    )

    async def override_get_db() -> AsyncIterator[AsyncSession]:
        async with session_factory() as session:
            yield session

    previous_overrides = app.dependency_overrides.copy()
    app.dependency_overrides.clear()
    app.dependency_overrides[get_db] = override_get_db
    try:
        async with AsyncClient(
            transport=ASGITransport(app=app), base_url="http://testserver"
        ) as client:
            yield client
    finally:
        app.dependency_overrides.clear()
        app.dependency_overrides.update(previous_overrides)


@pytest_asyncio.fixture
async def db_user_factory(db_session):
    from app.core import UserRole, hash_password
    from app.models import User

    async def build(
        *,
        email: str,
        username: str,
        role: UserRole = UserRole.USER,
        password: str = "test-password",
    ):
        user = User(
            email=email,
            username=username,
            password_hash=hash_password(password),
            role=role,
        )
        db_session.add(user)
        await db_session.flush()
        return user

    return build


@pytest_asyncio.fixture
async def clinic_factory(db_session):
    from app.models import Clinic

    async def build(*, name: str = "Test Clinic", pincode: str = "560001"):
        clinic = Clinic(
            name=name,
            address="1 Test Road",
            city="Bengaluru",
            state="Karnataka",
            pincode=pincode,
            phone="9876543210",
        )
        db_session.add(clinic)
        await db_session.flush()
        return clinic

    return build


@pytest_asyncio.fixture
async def authenticated_client(app_client: AsyncClient):
    """Factory for real signup/login and bearer-authenticated HTTPX clients."""

    from app.main import app

    clients: list[AsyncClient] = []

    async def build(*, email: str, username: str, password: str = "test-password"):
        response_client = AsyncClient(
            transport=ASGITransport(app=app), base_url="http://testserver"
        )
        signup = await response_client.post(
            "/api/v1/auth/signup",
            json={"email": email, "username": username, "password": password},
        )
        if signup.status_code != 201:
            await response_client.aclose()
            raise AssertionError(f"Signup failed ({signup.status_code}): {signup.text}")
        login = await response_client.post(
            "/api/v1/auth/login", json={"email": email, "password": password}
        )
        if login.status_code != 200:
            await response_client.aclose()
            raise AssertionError(f"Login failed ({login.status_code}): {login.text}")
        token = login.json()["access_token"]
        response_client.headers["Authorization"] = f"Bearer {token}"
        clients.append(response_client)
        return response_client, token

    yield build
    for client in clients:
        await client.aclose()


@pytest_asyncio.fixture
async def admin_client(authenticated_client, db_session):
    from app.core import UserRole
    from app.models import User

    client, _token = await authenticated_client(
        email="admin@example.com", username="admin"
    )
    user = await db_session.scalar(
        select(User).where(User.email == "admin@example.com")
    )
    user.role = UserRole.ADMIN
    await db_session.commit()
    return client


@pytest_asyncio.fixture
async def ordinary_user_client(authenticated_client):
    client, _ = await authenticated_client(
        email="user@example.com", username="ordinary-user"
    )
    return client


@pytest_asyncio.fixture
async def volunteer_client(authenticated_client, db_session):
    from app.core import UserRole
    from app.models import User

    client, _ = await authenticated_client(
        email="volunteer@example.com", username="volunteer"
    )
    user = await db_session.scalar(
        select(User).where(User.email == "volunteer@example.com")
    )
    user.role = UserRole.VOLUNTEER
    await db_session.commit()
    return client


@pytest_asyncio.fixture
async def approved_volunteer_client(authenticated_client, db_session):
    from app.core import UserRole, VolunteerApprovalStatus
    from app.models import User, Volunteer

    client, _ = await authenticated_client(
        email="approved-volunteer@example.com", username="approved-volunteer"
    )
    user = await db_session.scalar(
        select(User).where(User.email == "approved-volunteer@example.com")
    )
    user.role = UserRole.VOLUNTEER
    db_session.add(
        Volunteer(
            user_id=user.id,
            phone_number="9876543210",
            state="Karnataka",
            district="Bengaluru",
            area_name="Central",
            pincode="560001",
            service_pincodes=["560001"],
            approval_status=VolunteerApprovalStatus.APPROVED,
        )
    )
    await db_session.commit()
    return client


@pytest_asyncio.fixture
async def veterinarian_applicant_client(authenticated_client):
    client, _ = await authenticated_client(
        email="vet-applicant@example.com", username="vet-applicant"
    )
    return client


@pytest_asyncio.fixture
async def approved_veterinarian_client(
    authenticated_client, db_session, clinic_factory
):
    from app.core import UserRole, VeterinarianApprovalStatus
    from app.models import User, Veterinarian

    client, _ = await authenticated_client(
        email="approved-vet@example.com", username="approved-vet"
    )
    user = await db_session.scalar(
        select(User).where(User.email == "approved-vet@example.com")
    )
    clinic = await clinic_factory(name="Approved Vet Clinic")
    user.role = UserRole.VETERINARIAN
    db_session.add(
        Veterinarian(
            user_id=user.id,
            clinic_id=clinic.id,
            full_name="Approved Veterinarian",
            phone="9876543210",
            qualification="DVM",
            license_number="TEST-LICENSE-APPROVED",
            approval_status=VeterinarianApprovalStatus.APPROVED,
        )
    )
    await db_session.commit()
    return client


# Compatibility fixtures for the pre-existing synchronous, mocked route tests.
# They continue to exercise their original behavior without requiring PostgreSQL.
@pytest.fixture
def client():
    from fastapi.testclient import TestClient

    from app.main import app

    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture
def user_factory():
    from types import SimpleNamespace

    def build(user_id=1, role="user"):
        return SimpleNamespace(
            id=user_id,
            email=f"user{user_id}@example.com",
            username=f"user{user_id}",
            role=role,
        )

    return build
