from types import SimpleNamespace
from unittest.mock import AsyncMock

import pytest

from app.core import UserRole, VolunteerStatus
from app.exceptions import (
    AssignmentAlreadyClaimedException,
    AssignmentNotFoundException,
    NotAuthorizedException,
    ReportNotFoundException,
    VolunteerServiceNotAvailable,
)
from app.schemas import AssignAssignment, WorkAssignmentCreate
from app.services.implementation.work_assignment_service import WorkAssignmentService


def make_service(*, assignment=None, report=None, assigned_user=None, volunteer=None):
    db = SimpleNamespace(commit=AsyncMock(), rollback=AsyncMock())
    repo = SimpleNamespace(
        get_by_id=AsyncMock(return_value=assignment),
        create=AsyncMock(side_effect=lambda row: row),
        claim_assignment=AsyncMock(side_effect=lambda row, user_id: row),
        update_assigned_to=AsyncMock(side_effect=lambda row, user_id, admin_id: row),
    )
    reports = SimpleNamespace(get_by_id=AsyncMock(return_value=report))
    volunteers = SimpleNamespace(get_by_user_id=AsyncMock(return_value=volunteer))
    users = SimpleNamespace(get_by_id=AsyncMock(return_value=assigned_user))
    updates = SimpleNamespace()
    return (
        WorkAssignmentService(db, repo, reports, volunteers, users, updates),
        db,
        repo,
    )


@pytest.mark.asyncio
async def test_create_assignment_requires_existing_report():
    service, _, repo = make_service()
    data = WorkAssignmentCreate(report_id=3, title="Help dog", task_type="rescue")
    with pytest.raises(ReportNotFoundException):
        await service.create_work_assignment(SimpleNamespace(id=1), data)
    repo.create.assert_not_awaited()


@pytest.mark.asyncio
async def test_claim_assignment_sets_claim_and_commits():
    assignment = SimpleNamespace(assigned_to=None)
    volunteer = SimpleNamespace(approval_status=VolunteerStatus.APPROVED)
    service, db, repo = make_service(assignment=assignment, volunteer=volunteer)
    result = await service.claim_assignment(
        5, SimpleNamespace(id=8, role=UserRole.VOLUNTEER)
    )
    repo.claim_assignment.assert_awaited_once_with(assignment, 8)
    assert result is assignment
    db.commit.assert_awaited_once()


@pytest.mark.asyncio
async def test_claim_assignment_rejects_already_claimed_assignment():
    assignment = SimpleNamespace(assigned_to=9)
    volunteer = SimpleNamespace(approval_status=VolunteerStatus.APPROVED)
    service, _, repo = make_service(assignment=assignment, volunteer=volunteer)
    with pytest.raises(AssignmentAlreadyClaimedException):
        await service.claim_assignment(
            5, SimpleNamespace(id=8, role=UserRole.VOLUNTEER)
        )
    repo.claim_assignment.assert_not_awaited()


@pytest.mark.asyncio
async def test_claim_assignment_rejects_missing_assignment():
    service, _, _ = make_service(
        volunteer=SimpleNamespace(approval_status=VolunteerStatus.APPROVED)
    )
    with pytest.raises(AssignmentNotFoundException):
        await service.claim_assignment(
            5, SimpleNamespace(id=8, role=UserRole.VOLUNTEER)
        )


@pytest.mark.asyncio
async def test_update_status_requires_assignment_owner():
    service, _, _ = make_service(
        assignment=SimpleNamespace(assigned_to=9),
        volunteer=SimpleNamespace(approval_status=VolunteerStatus.APPROVED),
    )
    with pytest.raises(NotAuthorizedException):
        await service.update_status(
            5,
            SimpleNamespace(status="completed"),
            SimpleNamespace(id=8, role=UserRole.VOLUNTEER),
        )


@pytest.mark.asyncio
async def test_assign_rejects_volunteer_outside_service_area():
    assignment = SimpleNamespace(
        assigned_to=None, report=SimpleNamespace(pincode="560001")
    )
    volunteer = SimpleNamespace(
        service_pincodes=["560002"], approval_status=VolunteerStatus.APPROVED
    )
    service, _, repo = make_service(
        assignment=assignment,
        assigned_user=SimpleNamespace(id=8, role=UserRole.VOLUNTEER),
        volunteer=volunteer,
    )
    with pytest.raises(VolunteerServiceNotAvailable):
        await service.update_assigned_to(
            5, AssignAssignment(assigned_to=8), SimpleNamespace(id=1)
        )
    repo.update_assigned_to.assert_not_awaited()


@pytest.mark.asyncio
@pytest.mark.parametrize("status", [VolunteerStatus.PENDING, VolunteerStatus.REJECTED])
async def test_unapproved_volunteer_cannot_claim_assignment(status):
    service, _, repo = make_service(
        assignment=SimpleNamespace(assigned_to=None),
        volunteer=SimpleNamespace(approval_status=status),
    )
    with pytest.raises(NotAuthorizedException, match="approval is required"):
        await service.claim_assignment(
            5, SimpleNamespace(id=8, role=UserRole.VOLUNTEER)
        )
    repo.get_by_id.assert_not_awaited()
    repo.claim_assignment.assert_not_awaited()


@pytest.mark.asyncio
@pytest.mark.parametrize("status", [VolunteerStatus.PENDING, VolunteerStatus.REJECTED])
async def test_unapproved_volunteer_cannot_be_assigned(status):
    assignment = SimpleNamespace(
        assigned_to=None, report=SimpleNamespace(pincode="560001")
    )
    volunteer = SimpleNamespace(service_pincodes=["560001"], approval_status=status)
    service, _, repo = make_service(
        assignment=assignment,
        assigned_user=SimpleNamespace(id=8, role=UserRole.VOLUNTEER),
        volunteer=volunteer,
    )
    with pytest.raises(NotAuthorizedException, match="approval is required"):
        await service.update_assigned_to(
            5, AssignAssignment(assigned_to=8), SimpleNamespace(id=1)
        )
    repo.update_assigned_to.assert_not_awaited()
