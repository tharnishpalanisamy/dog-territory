from sqlalchemy import select

from app.core import AssignmentStatus, AssignmentType
from app.models import Report, User, WorkAssignment

CLINIC_DATA = {
    "name": "Central Animal Clinic",
    "address": "1 Test Road",
    "city": "Bengaluru",
    "state": "Karnataka",
    "pincode": "560001",
    "phone": "9876543210",
    "email": "clinic@example.com",
    "is_active": True,
}


async def test_admin_clinic_creation_and_non_admin_boundary(
    admin_client, ordinary_user_client, db_session
):
    denied = await ordinary_user_client.post("/api/v1/clinics/", json=CLINIC_DATA)
    assert denied.status_code == 403
    created = await admin_client.post("/api/v1/clinics/", json=CLINIC_DATA)
    assert created.status_code == 201
    assert (await admin_client.get(f"/api/v1/clinics/{created.json()['id']}")).status_code == 200
    assert (await ordinary_user_client.get("/api/v1/clinics/")).status_code == 403


async def test_admin_can_update_clinic_and_invalid_data_is_rejected(
    admin_client, ordinary_user_client
):
    invalid = await admin_client.post(
        "/api/v1/clinics/",
        json={**CLINIC_DATA, "name": "x", "email": "not-an-email"},
    )
    assert invalid.status_code == 422
    created = await admin_client.post("/api/v1/clinics/", json=CLINIC_DATA)
    clinic_id = created.json()["id"]
    updated = await admin_client.patch(
        f"/api/v1/clinics/{clinic_id}", json={"name": "Updated Clinic"}
    )
    assert updated.status_code == 200
    assert updated.json()["name"] == "Updated Clinic"
    assert (
        await ordinary_user_client.patch(
            f"/api/v1/clinics/{clinic_id}", json={"name": "Unauthorized edit"}
        )
    ).status_code == 403


async def test_admin_assignment_persists_report_relationship_and_user_cannot_create(
    admin_client, ordinary_user_client, db_session
):
    report = await ordinary_user_client.post(
        "/api/v1/reports/create",
        data={
            "report_type": "sick",
            "description": "Needs help",
            "state": "Karnataka",
            "district": "Bengaluru",
            "area_name": "Central",
            "pincode": "560001",
            "location": "Central Park",
        },
    )
    assert report.status_code == 201
    body = {
        "report_id": report.json()["id"],
        "title": "Rescue and transport",
        "description": "Take the dog for evaluation",
        "task_type": AssignmentType.RESCUE.value,
        "priority": "high",
    }
    assert (await ordinary_user_client.post("/api/v1/assignments/", json=body)).status_code == 403
    created = await admin_client.post("/api/v1/assignments/", json=body)
    assert created.status_code == 201
    row = await db_session.get(WorkAssignment, created.json()["id"])
    linked_report = await db_session.get(Report, row.report_id)
    assert row.status == AssignmentStatus.OPEN
    assert linked_report.id == report.json()["id"]
    assert row.assigned_to is None


async def test_volunteer_cannot_read_another_volunteers_assignment(
    admin_client,
    approved_volunteer_client,
    ordinary_user_client,
    authenticated_client,
    clinic_factory,
    db_session,
):
    second_volunteer, _ = await authenticated_client(
        email="second-volunteer@example.com", username="second-volunteer"
    )
    profile = await second_volunteer.post(
        "/api/v1/volunteers/",
        json={
            "phone_number": "9876543212",
            "state": "Karnataka",
            "district": "Bengaluru",
            "area_name": "Central",
            "pincode": "560001",
            "service_pincodes": ["560001"],
        },
    )
    assert profile.status_code == 201
    await admin_client.patch(
        f"/api/v1/volunteers/{profile.json()['id']}/approval",
        json={"approval_status": "approved"},
    )
    second_user = await db_session.scalar(
        select(User).where(User.email == "second-volunteer@example.com")
    )
    first_user = await db_session.scalar(
        select(User).where(User.email == "approved-volunteer@example.com")
    )
    report = await ordinary_user_client.post(
        "/api/v1/reports/create",
        data={
            "report_type": "sick",
            "description": "Private assigned case",
            "state": "Karnataka",
            "district": "Bengaluru",
            "area_name": "Central",
            "pincode": "560001",
            "location": "Central",
        },
    )
    assignment = await admin_client.post(
        "/api/v1/assignments/",
        json={
            "report_id": report.json()["id"],
            "title": "Assigned rescue",
            "task_type": "rescue",
            "assigned_to": first_user.id,
        },
    )
    assert assignment.status_code == 201
    assert (await second_volunteer.get("/api/v1/assignments/assigned")).json() == []
    clinic = await clinic_factory(name="Ownership Boundary Clinic")
    admission = await second_volunteer.post(
        f"/api/v1/assignment-updates/{assignment.json()['id']}/clinic_admission",
        json={
            "clinic_id": clinic.id,
            "title": "Unauthorized admission",
            "description": "Attempt by a different volunteer",
            "mode": "clinic",
        },
    )
    # The endpoint currently checks approval, but its service does not verify
    # that this volunteer owns the work assignment.
    assert admission.status_code == 403
    response = await second_volunteer.get(
        f"/api/v1/assignments/{assignment.json()['id']}"
    )
    # The access rule is part of the requested ownership boundary. Current
    # route/service code appears to return any assignment to any volunteer;
    # this assertion will expose that application defect when PostgreSQL runs.
    assert response.status_code == 403
    assert second_user.id != first_user.id

