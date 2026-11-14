from datetime import UTC, datetime, timedelta

import jwt
from sqlalchemy import func, select

from app.core import UserRole
from app.models import User


async def test_signup_persists_hashed_password_and_duplicate_is_rejected(
    app_client, db_session
):
    payload = {
        "username": "new-user",
        "email": "signup@example.com",
        "password": "correct-horse-battery",
    }
    response = await app_client.post("/api/v1/auth/signup", json=payload)
    assert response.status_code == 201
    assert response.json()["email"] == payload["email"]

    user = await db_session.scalar(select(User).where(User.email == payload["email"]))
    assert user is not None
    assert user.password_hash != payload["password"]

    duplicate = await app_client.post("/api/v1/auth/signup", json=payload)
    assert duplicate.status_code == 409
    assert await db_session.scalar(
        select(func.count()).select_from(User).where(User.email == payload["email"])
    ) == 1


async def test_invalid_signup_and_login_credentials_do_not_create_users(
    app_client, db_session
):
    invalid = await app_client.post(
        "/api/v1/auth/signup",
        json={"username": "", "email": "not-an-email", "password": "pw"},
    )
    assert invalid.status_code == 422
    bad_login = await app_client.post(
        "/api/v1/auth/login",
        json={"email": "nobody@example.com", "password": "wrong"},
    )
    assert bad_login.status_code == 401
    assert await db_session.scalar(
        select(func.count()).select_from(User).where(User.email == "nobody@example.com")
    ) == 0


async def test_application_commit_remains_inside_outer_test_transaction(
    app_client, test_engine
):
    email = "savepoint-visibility@example.com"
    response = await app_client.post(
        "/api/v1/auth/signup",
        json={"username": "savepoint", "email": email, "password": "long-enough"},
    )
    assert response.status_code == 201

    # Application code committed its AsyncSession, but that commit only released
    # the session savepoint. A separate connection cannot see test-local data.
    async with test_engine.connect() as independent_connection:
        visible = await independent_connection.scalar(
            select(User.id).where(User.email == email)
        )
    assert visible is None


async def test_refresh_rotates_tokens_and_logout_revokes_the_active_token(app_client):
    signup = await app_client.post(
        "/api/v1/auth/signup",
        json={
            "username": "refresh-user",
            "email": "refresh-flow@example.com",
            "password": "refresh-password",
        },
    )
    assert signup.status_code == 201
    login = await app_client.post(
        "/api/v1/auth/login",
        json={"email": "refresh-flow@example.com", "password": "refresh-password"},
    )
    assert login.status_code == 200
    old_refresh = login.json()["refresh_token"]
    rotated = await app_client.post(
        "/api/v1/auth/refresh", json={"refresh_token": old_refresh}
    )
    assert rotated.status_code == 201
    new_refresh = rotated.json()["refresh_token"]
    assert new_refresh != old_refresh
    assert (
        await app_client.post("/api/v1/auth/logout", json={"refresh_token": new_refresh})
    ).status_code == 204
    assert (
        await app_client.post("/api/v1/auth/refresh", json={"refresh_token": new_refresh})
    ).status_code == 401


async def test_authentication_requires_valid_token_and_reloads_role_from_database(
    authenticated_client, db_session
):
    client, token = await authenticated_client(
        email="role-refresh@example.com", username="role-refresh"
    )
    me = await client.get("/api/v1/auth/me")
    assert me.status_code == 200
    assert me.json()["email"] == "role-refresh@example.com"

    client.headers.pop("Authorization")
    assert (await client.get("/api/v1/auth/me")).status_code == 401
    client.headers["Authorization"] = "Bearer invalid-token"
    assert (await client.get("/api/v1/auth/me")).status_code == 401
    expired = jwt.encode(
        {"sub": "0", "exp": datetime.now(UTC) - timedelta(minutes=1)},
        "test-only-secret-key-for-tests-32-bytes",
        algorithm="HS256",
    )
    client.headers["Authorization"] = f"Bearer {expired}"
    assert (await client.get("/api/v1/auth/me")).status_code == 401

    user = await db_session.scalar(
        select(User).where(User.email == "role-refresh@example.com")
    )
    user.role = UserRole.ADMIN
    await db_session.commit()
    client.headers["Authorization"] = f"Bearer {token}"
    # /clinics is admin-only; success with the original token proves that role
    # authorization loads current PostgreSQL state rather than JWT role claims.
    assert (await client.get("/api/v1/clinics/")).status_code == 200
