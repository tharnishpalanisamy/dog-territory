"""Reconcile assignment enum labels with application values.

Revision ID: 5d7a2b9c1e04
Revises: 4e71a9c2f6b0
Create Date: 2026-11-13
"""

from alembic import op

revision = "5d7a2b9c1e04"
down_revision = "4e71a9c2f6b0"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Some databases were stamped past the original lowercase-enum migration
    # without applying its DDL. Rename only labels that still need conversion,
    # so this also works on databases that already have lowercase labels.
    for enum_name, labels in {
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
    }.items():
        for old_label, new_label in labels.items():
            op.execute(
                "DO $$ BEGIN "
                "IF EXISTS (SELECT 1 FROM pg_enum e "
                "JOIN pg_type t ON t.oid = e.enumtypid "
                "WHERE t.typname = '" + enum_name + "' "
                "AND e.enumlabel = '" + old_label + "') "
                "AND NOT EXISTS (SELECT 1 FROM pg_enum e "
                "JOIN pg_type t ON t.oid = e.enumtypid "
                "WHERE t.typname = '" + enum_name + "' "
                "AND e.enumlabel = '" + new_label + "') THEN "
                "ALTER TYPE \"" + enum_name + "\" RENAME VALUE '" + old_label
                + "' TO '" + new_label + "'; END IF; END $$"
            )


def downgrade() -> None:
    # Enum labels are shared schema state; keep the normalized labels.
    pass
