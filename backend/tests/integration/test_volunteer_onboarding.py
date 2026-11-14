from sqlalchemy import select

from app.core import UserRole, VolunteerApprovalStatus
from app.models import User, Volunteer

VOLUNTEER_DATA = {
    "phone_number": "9876543210",
    "state": "Karnataka",
    "district": "Bengaluru",
    "area_name": "Central",
    "pincode": "560001",
    "availability": "weekends",
    "service_pincodes": ["560001"],
}


async def test_volunteer_application_is_reviewed_and_same_token_gets_approved_role(
    ordinary_user_client, admin_client, db_session
):
    applicant = ordinary_user_client
    created = await applicant.post("/api/v1/volunteers/", json=VOLUNTEER_DATA)
    assert created.status_code == 201
    volunteer_id = created.json()["id"]
    assert created.json()["approval_status"] == "pending"
    assert (await applicant.post("/api/v1/volunteers/", json=VOLUNTEER_DATA)).status_code == 409

    user = await db_session.scalar(
        select(User).where(User.email == "user@example.com")
    )
    profile = await db_session.get(Volunteer, volunteer_id)
    assert profile.user_id == user.id
    assert profile.approval_status == VolunteerApprovalStatus.PENDING
    assert user.role == UserRole.USER

    assert (
        await applicant.patch(
            f"/api/v1/volunteers/{volunteer_id}/approval",
            json={"approval_status": "approved"},
        )
    ).status_code == 403
    approved = await admin_client.patch(
        f"/api/v1/volunteers/{volunteer_id}/approval",
        json={"approval_status": "approved"},
    )
    assert approved.status_code == 200
    await db_session.refresh(user)
    await db_session.refresh(profile)
    assert profile.approval_status == VolunteerApprovalStatus.APPROVED
    assert user.role == UserRole.VOLUNTEER
    assert (await applicant.get("/api/v1/volunteers/me")).status_code == 200


async def test_rejected_volunteer_keeps_user_role_and_is_denied_volunteer_routes(
    ordinary_user_client, admin_client, db_session
):
    applicant = ordinary_user_client
    created = await applicant.post("/api/v1/volunteers/", json=VOLUNTEER_DATA)
    assert created.status_code == 201
    volunteer_id = created.json()["id"]
    rejected = await admin_client.patch(
        f"/api/v1/volunteers/{volunteer_id}/approval",
        json={"approval_status": "rejected"},
    )
    assert rejected.status_code == 200

    user = await db_session.scalar(
        select(User).where(User.email == "user@example.com")
    )
    profile = await db_session.get(Volunteer, volunteer_id)
    assert user.role == UserRole.USER
    assert profile.approval_status == VolunteerApprovalStatus.REJECTED
    assert (await applicant.get("/api/v1/volunteers/me")).status_code == 403

