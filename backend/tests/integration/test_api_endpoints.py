from types import SimpleNamespace
from unittest.mock import AsyncMock

import pytest

from app.dependencies import get_auth_service, get_current_user, get_dog_service, get_reports_service


@pytest.fixture(autouse=True)
def clear_overrides(client):
    from app.main import app

    app.dependency_overrides.clear()
    yield
    app.dependency_overrides.clear()


def dog_record(dog_id=1):
    return SimpleNamespace(
        id=dog_id, dog_code="560001-1", estimated_age=3, color="brown",
        description="Friendly", is_sterilized=False, status="active",
        vaccination_status="unknown", vaccination_date=None,
        next_booster_due_date=None, state="Karnataka", district="Bengaluru",
        area_name="Park", pincode="560001", created_at="2026-01-01T00:00:00Z",
        updated_at=None,
    )


def report_record(report_id=1):
    return SimpleNamespace(
        id=report_id, reporter_id=1, dog_id=None, report_type="sick",
        description="Injured", pincode="560001", location="Park",
        image_filename=None, status="pending", created_at="2026-01-01T00:00:00Z",
        updated_at=None,
    )


def test_signup_and_login_endpoints(client):
    user = SimpleNamespace(id=1, email="a@example.com", username="A")
    auth = SimpleNamespace(
        signup_user=AsyncMock(return_value=user),
        authenticate_user=AsyncMock(return_value={"access_token": "a", "refresh_token": "r", "token_type": "bearer", "user": user}),
        refresh_token=AsyncMock(return_value={"access_token": "a2", "refresh_token": "r2", "token_type": "bearer"}),
    )
    from app.main import app
    app.dependency_overrides[get_auth_service] = lambda: auth
    response = client.post("/api/v1/auth/signup", json={"username": "A", "email": "a@example.com", "password": "pw"})
    assert response.status_code == 201
    assert response.json()["id"] == 1
    response = client.post("/api/v1/auth/login", json={"email": "a@example.com", "password": "pw"})
    assert response.status_code == 200
    assert response.json()["access_token"] == "a"
    response = client.post("/api/v1/auth/refresh", json={"refresh_token": "old"})
    assert response.status_code == 201


def test_me_requires_valid_user(client, user_factory):
    response = client.get("/api/v1/auth/me")
    assert response.status_code == 401
    from app.main import app
    app.dependency_overrides[get_current_user] = lambda: user_factory()
    response = client.get("/api/v1/auth/me")
    assert response.status_code == 200
    assert response.json()["email"] == "user1@example.com"


def test_dog_endpoints_and_role_access(client, user_factory):
    from app.main import app
    service = SimpleNamespace(
        create_dog=AsyncMock(return_value=dog_record()),
        get_all_dogs=AsyncMock(return_value=[dog_record()]),
        get_dog_by_id=AsyncMock(return_value=dog_record()),
        get_dog_by_dog_code=AsyncMock(return_value=dog_record()),
        update_dog_by_id=AsyncMock(return_value=dog_record()),
        update_dog_by_dog_code=AsyncMock(return_value=dog_record()),
        delete_dog_by_id=AsyncMock(), delete_dog_by_dog_code=AsyncMock(),
    )
    app.dependency_overrides[get_current_user] = lambda: user_factory(role="admin")
    app.dependency_overrides[get_dog_service] = lambda: service
    data = {"state":"Karnataka", "district":"Bengaluru", "area_name":"Park", "pin_code":"560001", "latitude":12.9, "longitude":77.6, "vaccination_status":"unknown"}
    assert client.post("/api/v1/dogs/", json=data).status_code == 201
    assert client.get("/api/v1/dogs/").status_code == 200
    assert client.get("/api/v1/dogs/1").status_code == 200
    assert client.get("/api/v1/dogs/code/560001-1").status_code == 200
    assert client.patch("/api/v1/dogs/1", json={"color":"white"}).status_code == 200
    assert client.patch("/api/v1/dogs/code/560001-1", json={"color":"white"}).status_code == 200
    assert client.delete("/api/v1/dogs/1").status_code == 204
    assert client.delete("/api/v1/dogs/code/560001-1").status_code == 204


def test_dog_rejects_user_role_on_management_endpoint(client, user_factory):
    from app.main import app
    app.dependency_overrides[get_current_user] = lambda: user_factory(role="user")
    response = client.get("/api/v1/dogs/")
    assert response.status_code == 403


def test_report_endpoints(client, user_factory):
    from app.main import app
    service = SimpleNamespace(
        create_report=AsyncMock(return_value=report_record()),
        get_all_reports=AsyncMock(return_value=[report_record()]),
        get_current_user_reports=AsyncMock(return_value=[report_record()]),
        get_assigned_reports=AsyncMock(return_value=[]),
        get_report_by_id=AsyncMock(return_value=report_record()),
    )
    app.dependency_overrides[get_current_user] = lambda: user_factory(role="admin")
    app.dependency_overrides[get_reports_service] = lambda: service
    created = client.post("/api/v1/reports/create", data={"report_type":"sick", "description":"Injured", "pincode":"560001", "location":"Park"})
    assert created.status_code == 201
    assert client.get("/api/v1/reports/").status_code == 200
    assert client.get("/api/v1/reports/me").status_code == 200
    assert client.get("/api/v1/reports/1").status_code == 200


def test_assigned_reports_requires_veterinarian(client, user_factory):
    from app.main import app
    app.dependency_overrides[get_current_user] = lambda: user_factory(role="user")
    response = client.get("/api/v1/reports/assigned")
    assert response.status_code == 403
