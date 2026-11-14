import importlib

from sqlalchemy import select

from app.core import AssignmentStatus, MedicalAssignmentStatus, UserRole
from app.models import (
    AssignmentUpdate,
    Dog,
    MedicalAssignment,
    MedicalAssignmentUpdate,
    Report,
    User,
    Veterinarian,
    Volunteer,
    WorkAssignment,
)


async def test_report_to_clinic_treatment_and_volunteer_release(
    app_client,
    authenticated_client,
    admin_client,
    approved_veterinarian_client,
    db_session,
    temp_upload_dir,
    monkeypatch,
):
    image_storage = importlib.import_module("app.utilities.save_image")
    monkeypatch.setattr(image_storage, "UPLOAD_DIR", temp_upload_dir)

    reporter, _ = await authenticated_client(
        email="e2e-reporter@example.com", username="e2e-reporter"
    )
    volunteer, _ = await authenticated_client(
        email="e2e-volunteer@example.com", username="e2e-volunteer"
    )
    veterinarian, _ = await authenticated_client(
        email="e2e-veterinarian@example.com", username="e2e-veterinarian"
    )
    other_veterinarian = approved_veterinarian_client

    clinic_response = await admin_client.post(
        "/api/v1/clinics/",
        json={
            "name": "Rescue Clinic",
            "address": "2 Clinic Road",
            "city": "Bengaluru",
            "state": "Karnataka",
            "pincode": "560001",
            "phone": "9876543210",
            "email": "rescue-clinic@example.com",
        },
    )
    assert clinic_response.status_code == 201
    clinic_id = clinic_response.json()["id"]

    dog_response = await admin_client.post(
        "/api/v1/dogs/",
        json={
            "state": "Karnataka",
            "district": "Bengaluru",
            "area_name": "Central",
            "pin_code": "560001",
            "latitude": 12.9,
            "longitude": 77.6,
            "vaccination_status": "unknown",
        },
    )
    assert dog_response.status_code == 201
    dog_code = dog_response.json()["dog_code"]

    no_dog_report = await reporter.post(
        "/api/v1/reports/create",
        data={
            "report_type": "sick",
            "description": "Unidentified dog report",
            "state": "Karnataka",
            "district": "Bengaluru",
            "area_name": "Central",
            "pincode": "560001",
            "location": "Near the market",
        },
        files={"image": ("report.png", b"temporary-test-image", "image/png")},
    )
    assert no_dog_report.status_code == 201
    report_response = await reporter.post(
        "/api/v1/reports/create",
        data={
            "report_type": "injured",
            "description": "Dog needs treatment",
            "state": "Karnataka",
            "district": "Bengaluru",
            "area_name": "Central",
            "pincode": "560001",
            "location": "Central square",
            "dog_code": dog_code,
        },
    )
    assert report_response.status_code == 201
    report_id = report_response.json()["id"]

    volunteer_application = await volunteer.post(
        "/api/v1/volunteers/",
        json={
            "phone_number": "9876543211",
            "state": "Karnataka",
            "district": "Bengaluru",
            "area_name": "Central",
            "pincode": "560001",
            "availability": "weekends",
            "service_pincodes": ["560001"],
        },
    )
    assert volunteer_application.status_code == 201
    volunteer_profile_id = volunteer_application.json()["id"]
    veterinarian_application = await veterinarian.post(
        "/api/v1/veterinarians/",
        json={
            "clinic_id": clinic_id,
            "full_name": "E2E Veterinarian",
            "phone": "9876543212",
            "qualification": "DVM",
            "license_number": "E2E-LICENSE-PRIMARY",
        },
    )
    assert veterinarian_application.status_code == 201
    veterinarian_profile_id = veterinarian_application.json()["id"]

    approved_volunteer = await admin_client.patch(
        f"/api/v1/volunteers/{volunteer_profile_id}/approval",
        json={"approval_status": "approved"},
    )
    assert approved_volunteer.status_code == 200
    approved_vet = await admin_client.patch(
        f"/api/v1/veterinarians/{veterinarian_profile_id}/approval",
        json={"approval_status": "approved"},
    )
    assert approved_vet.status_code == 200
    # Both tokens were issued before role changes; the request dependencies read
    # the updated roles from PostgreSQL on each request.
    assert (await volunteer.get("/api/v1/volunteers/me")).status_code == 200
    assert (await veterinarian.get("/api/v1/medical-assignments/")).status_code == 200

    reporter_row = await db_session.scalar(
        select(User).where(User.email == "e2e-reporter@example.com")
    )
    volunteer_row = await db_session.scalar(
        select(User).where(User.email == "e2e-volunteer@example.com")
    )
    veterinarian_row = await db_session.scalar(
        select(User).where(User.email == "e2e-veterinarian@example.com")
    )
    assert volunteer_row.role == UserRole.VOLUNTEER
    assert veterinarian_row.role == UserRole.VETERINARIAN

    work_response = await admin_client.post(
        "/api/v1/assignments/",
        json={
            "report_id": report_id,
            "title": "Transport for treatment",
            "description": "Take the dog to the clinic",
            "task_type": "transport",
            "priority": "high",
        },
    )
    assert work_response.status_code == 201
    work_id = work_response.json()["id"]
    assignment_response = await admin_client.patch(
        f"/api/v1/assignments/{work_id}/assign",
        json={"assigned_to": volunteer_row.id},
    )
    assert assignment_response.status_code == 200
    assert assignment_response.json()["assigned_to"] == volunteer_row.id
    assert len((await volunteer.get("/api/v1/assignments/assigned")).json()) == 1

    update_response = await volunteer.post(
        "/api/v1/assignment-updates/",
        json={
            "assignment_id": work_id,
            "update_type": "progress",
            "description": "Dog picked up and transported",
        },
    )
    assert update_response.status_code == 200
    admission = await volunteer.post(
        f"/api/v1/assignment-updates/{work_id}/clinic_admission",
        json={
            "clinic_id": clinic_id,
            "title": "Initial examination",
            "description": "Examine and treat the injured dog",
            "mode": "clinic",
        },
    )
    assert admission.status_code == 201
    medical_id = admission.json()["id"]

    cross_clinic_claim = await other_veterinarian.patch(
        f"/api/v1/medical-assignments/{medical_id}/claim"
    )
    assert cross_clinic_claim.status_code == 403
    claimed = await veterinarian.patch(
        f"/api/v1/medical-assignments/{medical_id}/claim"
    )
    assert claimed.status_code == 200
    started = await veterinarian.patch(
        f"/api/v1/medical-assignments/{medical_id}/start"
    )
    assert started.status_code == 200
    treatment = await veterinarian.post(
        f"/api/v1/medical-assignments/{medical_id}/updates",
        json={"update_type": "diagnosis", "description": "Minor leg injury"},
    )
    assert treatment.status_code == 201
    ready = await veterinarian.patch(
        f"/api/v1/medical-assignments/{medical_id}/ready-for-pickup"
    )
    assert ready.status_code == 200
    released = await volunteer.patch(f"/api/v1/medical-assignments/{medical_id}/release")
    assert released.status_code == 200

    report = await db_session.get(Report, report_id)
    dog = await db_session.scalar(select(Dog).where(Dog.dog_code == dog_code))
    work = await db_session.get(WorkAssignment, work_id)
    medical = await db_session.get(MedicalAssignment, medical_id)
    volunteer_profile = await db_session.get(Volunteer, volunteer_profile_id)
    vet_profile = await db_session.get(Veterinarian, veterinarian_profile_id)
    assert report.reporter_id == reporter_row.id
    assert report.dog_id == dog.id
    assert work.report_id == report.id
    assert work.assigned_to == volunteer_row.id
    assert work.status == AssignmentStatus.COMPLETED
    assert medical.work_assignment_id == work.id
    assert medical.dog_id == dog.id
    assert medical.clinic_id == clinic_id
    assert medical.volunteer_id == volunteer_row.id
    assert medical.veterinarian_id == vet_profile.id
    assert medical.status == MedicalAssignmentStatus.RELEASED
    assert volunteer_profile.user_id == volunteer_row.id
    assert treatment.json()["updated_by"] == veterinarian_row.id
    assert await db_session.scalar(
        select(AssignmentUpdate).where(AssignmentUpdate.assignment_id == work_id)
    ) is not None
    assert await db_session.scalar(
        select(MedicalAssignmentUpdate).where(
            MedicalAssignmentUpdate.medical_assignment_id == medical_id
        )
    ) is not None
