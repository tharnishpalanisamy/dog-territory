from sqlalchemy import select

from app.core import UserRole, VeterinarianApprovalStatus
from app.models import User, Veterinarian


def application_payload(clinic_id: int, license_number: str):
    return {
        "clinic_id": clinic_id,
        "full_name": "Taylor Veterinarian",
        "phone": "9876543210",
        "qualification": "DVM",
        "license_number": license_number,
        "specialization": "Surgery",
        "years_of_experience": 6,
    }


async def test_veterinarian_application_requires_existing_clinic(
    veterinarian_applicant_client, db_session
):
    from sqlalchemy import func

    response = await veterinarian_applicant_client.post(
        "/api/v1/veterinarians/",
        json=application_payload(99999999, "LICENSE-MISSING-CLINIC"),
    )
    assert response.status_code == 404
    assert await db_session.scalar(select(func.count()).select_from(Veterinarian)) == 0


async def test_veterinarian_application_duplicate_admin_review_and_live_role_change(
    veterinarian_applicant_client,
    admin_client,
    clinic_factory,
    db_session,
):
    clinic = await clinic_factory(name="Onboarding Clinic")
    applicant = veterinarian_applicant_client
    payload = application_payload(clinic.id, "LICENSE-ONBOARD-1")

    response = await applicant.post("/api/v1/veterinarians/", json=payload)
    assert response.status_code == 201
    veterinarian_id = response.json()["id"]
    assert response.json()["approval_status"] == "pending"
    assert (await applicant.post("/api/v1/veterinarians/", json=payload)).status_code == 409
    assert (await applicant.get("/api/v1/medical-assignments/")).status_code == 403
    assert (await applicant.get("/api/v1/veterinarians/pending")).status_code == 403

    user = await db_session.scalar(
        select(User).where(User.email == "vet-applicant@example.com")
    )
    vet = await db_session.get(Veterinarian, veterinarian_id)
    assert user.role == UserRole.USER
    assert vet.approval_status == VeterinarianApprovalStatus.PENDING
    assert vet.clinic_id == clinic.id

    pending = await admin_client.get("/api/v1/veterinarians/pending")
    assert pending.status_code == 200
    assert veterinarian_id in {item["id"] for item in pending.json()}
    reviewed = await admin_client.patch(
        f"/api/v1/veterinarians/{veterinarian_id}/approval",
        json={"approval_status": "approved"},
    )
    assert reviewed.status_code == 200
    assert reviewed.json()["approval_status"] == "approved"
    await db_session.refresh(user)
    await db_session.refresh(vet)
    assert user.role == UserRole.VETERINARIAN
    assert vet.reviewed_by is not None
    assert vet.reviewed_at is not None

    # The request's original JWT is retained; get_current_user reloads this role.
    assert (await applicant.get("/api/v1/medical-assignments/")).status_code == 200


async def test_rejected_veterinarian_cannot_claim_medical_assignments(
    veterinarian_applicant_client,
    admin_client,
    clinic_factory,
    db_session,
):
    from app.core import MedicalAssignmentMode
    from app.models import MedicalAssignment

    clinic = await clinic_factory(name="Review Clinic")
    applicant = veterinarian_applicant_client
    created = await applicant.post(
        "/api/v1/veterinarians/",
        json=application_payload(clinic.id, "LICENSE-REJECT-1"),
    )
    assert created.status_code == 201
    veterinarian_id = created.json()["id"]
    admin_user = await db_session.scalar(
        select(User).where(User.email == "admin@example.com")
    )
    assignment = MedicalAssignment(
        clinic_id=clinic.id,
        created_by=admin_user.id,
        title="Pending medical review",
        description="Test assignment",
        mode=MedicalAssignmentMode.CLINIC,
    )
    db_session.add(assignment)
    await db_session.flush()
    assert (
        await applicant.patch(
            f"/api/v1/medical-assignments/{assignment.id}/claim"
        )
    ).status_code == 403

    rejected = await admin_client.patch(
        f"/api/v1/veterinarians/{veterinarian_id}/approval",
        json={"approval_status": "rejected", "rejection_reason": "License could not be verified"},
    )
    assert rejected.status_code == 200
    assert rejected.json()["rejection_reason"] == "License could not be verified"
    assert (
        await applicant.patch(
            f"/api/v1/medical-assignments/{assignment.id}/claim"
        )
    ).status_code == 403
    vet_user = await db_session.scalar(
        select(User).where(User.email == "vet-applicant@example.com")
    )
    vet = await db_session.get(Veterinarian, veterinarian_id)
    assert vet_user.role == UserRole.USER
    assert vet.approval_status == VeterinarianApprovalStatus.REJECTED

