"""Add assigned work assignment status.

Revision ID: 6a2c9f1d8e40
Revises: 3c99b071b7b9
Create Date: 2026-11-13
"""

from alembic import op

revision = "6a2c9f1d8e40"
down_revision = "3c99b071b7b9"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        "ALTER TYPE assignment_status_enum "
        "ADD VALUE IF NOT EXISTS 'assigned' AFTER 'open'"
    )


def downgrade() -> None:
    # PostgreSQL enum values cannot be removed without rebuilding the type.
    pass
