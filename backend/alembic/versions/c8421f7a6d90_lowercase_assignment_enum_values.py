"""lowercase assignment enum values

Revision ID: c8421f7a6d90
Revises: edf017cb8804
Create Date: 2026-11-10

"""
from typing import Sequence, Union

from alembic import op


revision: str = "c8421f7a6d90"
down_revision: Union[str, Sequence[str], None] = "edf017cb8804"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    enum_value_renames = {
        "assignment_type_enum": {
            "RESCUE": "rescue",
            "TRANSPORT": "transport",
            "VACCINATION": "vaccination",
            "STERILIZATION": "sterilization",
            "MEDICAL_CARE": "medical_care",
            "FEEDING": "feeding",
            "OTHER": "other",
        },
        "assignment_priority_enum": {
            "LOW": "low",
            "NORMAL": "normal",
            "HIGH": "high",
            "URGENT": "urgent",
        },
        "assignment_status_enum": {
            "OPEN": "open",
            "ACCEPTED": "accepted",
            "IN_PROGRESS": "in_progress",
            "COMPLETED": "completed",
            "CANCELLED": "cancelled",
        },
        "assignment_update_type_enum": {
            "PROGRESS": "progress",
            "NOTE": "note",
            "ISSUE": "issue",
            "LOCATION": "location",
        },
    }

    for enum_name, values in enum_value_renames.items():
        for old_value, new_value in values.items():
            op.execute(
                f'ALTER TYPE "{enum_name}" RENAME VALUE '
                f"'{old_value}' TO '{new_value}'"
            )


def downgrade() -> None:
    enum_value_renames = {
        "assignment_update_type_enum": {
            "progress": "PROGRESS",
            "note": "NOTE",
            "issue": "ISSUE",
            "location": "LOCATION",
        },
        "assignment_status_enum": {
            "open": "OPEN",
            "accepted": "ACCEPTED",
            "in_progress": "IN_PROGRESS",
            "completed": "COMPLETED",
            "cancelled": "CANCELLED",
        },
        "assignment_priority_enum": {
            "low": "LOW",
            "normal": "NORMAL",
            "high": "HIGH",
            "urgent": "URGENT",
        },
        "assignment_type_enum": {
            "rescue": "RESCUE",
            "transport": "TRANSPORT",
            "vaccination": "VACCINATION",
            "sterilization": "STERILIZATION",
            "medical_care": "MEDICAL_CARE",
            "feeding": "FEEDING",
            "other": "OTHER",
        },
    }

    for enum_name, values in enum_value_renames.items():
        for old_value, new_value in values.items():
            op.execute(
                f'ALTER TYPE "{enum_name}" RENAME VALUE '
                f"'{old_value}' TO '{new_value}'"
            )
