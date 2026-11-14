from sqlalchemy import select

from app.core import MedicalAssignmentMode, MedicalAssignmentStatus
from app.models import (
    MedicalAssignment,
    MedicalAssignmentUpdate,
    User,
    Veterinarian,
)


async def test_medical_assignment_claim_treatment_ready_and_release_transitions(
    approved_veterinarian_client,
    approved_volunteer_client,
    ordinary_user_client,
    db_session,
):
    vet_user = await db_session.scalar(
        select(User).where(User.email == "approved-vet@example.com")
    )
    vet_profile = await db_session.scalar(
        select(Veterinarian).where(Veterinarian.user_id == vet_user.id)
    )
    volunteer_user = await db_session.scalar(
        select(User).where(User.email == "approved-volunteer@example.com")
    )
    assignment = MedicalAssignment(
        clinic_id=vet_profile.clinic_id,
        created_by=vet_user.id,
        volunteer_id=volunteer_user.id,
        title="Test medical care",
        description="Examination and treatment",
        mode=MedicalAssignmentMode.CLINIC,
    )
    db_session.add(assignment)
    await db_session.flush()

    path = f"/api/v1/medical-assignments/{assignment.id}"
    assert (await ordinary_user_client.patch(f"{path}/claim")).status_code == 403
    assert (await approved_veterinarian_client.patch(f"{path}/start")).status_code == 403

    claimed = await approved_veterinarian_client.patch(f"{path}/claim")
    assert claimed.status_code == 200
    assert claimed.json()["status"] == MedicalAssignmentStatus.CLAIMED.value
    assert (await approved_veterinarian_client.patch(f"{path}/claim")).status_code == 403
    # Starting is required before treatment can be marked ready.
    assert (
        await approved_veterinarian_client.patch(f"{path}/ready-for-pickup")
    ).status_code == 403
    started = await approved_veterinarian_client.patch(f"{path}/start")
    assert started.status_code == 200

    treatment = await approved_veterinarian_client.post(
        f"{path}/updates",
        json={"update_type": "diagnosis", "description": "Minor injury"},
    )
    assert treatment.status_code == 201
    assert (
        await ordinary_user_client.patch(f"/api/v1/medical-assignment-updates/{treatment.json()['id']}", json={"description": "tamper"})
    ).status_code == 403
    updates = await approved_veterinarian_client.get(f"{path}/updates")
    assert updates.status_code == 200
    assert updates.json()[0]["id"] == treatment.json()["id"]

    assert (
        await approved_volunteer_client.patch(f"{path}/release")
    ).status_code == 403
    ready = await approved_veterinarian_client.patch(f"{path}/ready-for-pickup")
    assert ready.status_code == 200
    released = await approved_volunteer_client.patch(f"{path}/release")
    assert released.status_code == 200

    await db_session.refresh(assignment)
    update = await db_session.get(MedicalAssignmentUpdate, treatment.json()["id"])
    assert assignment.status == MedicalAssignmentStatus.RELEASED
    assert assignment.veterinarian_id == vet_profile.id
    assert update.updated_by == vet_user.id
