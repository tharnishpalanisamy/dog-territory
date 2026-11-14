import importlib
from pathlib import Path

from sqlalchemy import select

from app.models import Dog, Report


def report_form(**overrides):
    values = {
        "report_type": "sick",
        "description": "Limping near the park",
        "state": "Karnataka",
        "district": "Bengaluru",
        "area_name": "Central Park",
        "pincode": "560001",
        "location": "North gate",
    }
    values.update(overrides)
    return values


async def test_report_without_dog_is_persisted_for_authenticated_reporter(
    ordinary_user_client, admin_client, db_session
):
    client = ordinary_user_client
    response = await client.post(
        "/api/v1/reports/create", data=report_form()
    )
    assert response.status_code == 201
    own_reports = await client.get("/api/v1/reports/me")
    assert own_reports.status_code == 200
    assert own_reports.json()[0]["id"] == response.json()["id"]

    report = await db_session.get(Report, response.json()["id"])
    assert report is not None
    assert report.reporter_id == own_reports.json()[0]["reporter_id"]
    assert report.dog_id is None
    assert report.status.value == "pending"

    reviewed = await admin_client.patch(
        f"/api/v1/reports/{report.id}/status",
        json={"status": "in_progress"},
    )
    assert reviewed.status_code == 200
    await db_session.refresh(report)
    assert report.status.value == "in_progress"


async def test_report_links_existing_dog_and_photo_uses_temporary_storage(
    admin_client, ordinary_user_client, db_session, temp_upload_dir, monkeypatch
):
    storage = importlib.import_module("app.utilities.save_image")
    monkeypatch.setattr(storage, "UPLOAD_DIR", temp_upload_dir)
    dog_response = await admin_client.post(
        "/api/v1/dogs/",
        json={
            "state": "Karnataka",
            "district": "Bengaluru",
            "area_name": "Central Park",
            "pin_code": "560001",
            "latitude": 12.9,
            "longitude": 77.6,
            "vaccination_status": "unknown",
        },
    )
    assert dog_response.status_code == 201
    dog = await db_session.get(Dog, dog_response.json()["id"])

    response = await ordinary_user_client.post(
        "/api/v1/reports/create",
        data=report_form(dog_code=dog.dog_code),
        files={"image": ("injury.png", b"test-image-content", "image/png")},
    )
    assert response.status_code == 201
    report = await db_session.get(Report, response.json()["id"])
    assert report.dog_id == dog.id
    assert report.reporter_id is not None
    assert report.image_filename == "injury.png"
    assert report.image_path is not None
    assert Path(report.image_path).exists()


async def test_invalid_report_references_and_uploads_do_not_persist(
    ordinary_user_client, db_session, temp_upload_dir, monkeypatch
):
    storage = importlib.import_module("app.utilities.save_image")
    monkeypatch.setattr(storage, "UPLOAD_DIR", temp_upload_dir)
    bad_dog = await ordinary_user_client.post(
        "/api/v1/reports/create",
        data=report_form(dog_code="missing-dog-code"),
    )
    assert bad_dog.status_code == 404
    bad_file = await ordinary_user_client.post(
        "/api/v1/reports/create",
        data=report_form(),
        files={"image": ("notes.txt", b"not an image", "text/plain")},
    )
    assert bad_file.status_code == 400
    assert await db_session.scalar(
        select(Report).where(Report.description == "Limping near the park")
    ) is None
    assert list(temp_upload_dir.iterdir()) == []


async def test_report_upload_size_and_required_fields_are_validated(
    ordinary_user_client, db_session, temp_upload_dir, monkeypatch
):
    storage = importlib.import_module("app.utilities.save_image")
    monkeypatch.setattr(storage, "UPLOAD_DIR", temp_upload_dir)
    missing_fields = await ordinary_user_client.post(
        "/api/v1/reports/create", data={"report_type": "sick"}
    )
    assert missing_fields.status_code == 422
    oversized = await ordinary_user_client.post(
        "/api/v1/reports/create",
        data=report_form(),
        files={"image": ("too-large.png", b"x" * (5 * 1024 * 1024 + 1), "image/png")},
    )
    assert oversized.status_code == 400
    assert await db_session.scalar(
        select(Report).where(Report.description == "Limping near the park")
    ) is None
    assert list(temp_upload_dir.iterdir()) == []

