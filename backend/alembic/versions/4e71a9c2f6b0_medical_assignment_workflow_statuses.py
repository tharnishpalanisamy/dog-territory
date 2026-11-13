"""Add medical assignment pickup and release statuses.

Revision ID: 4e71a9c2f6b0
Revises: c34ef633d962
Create Date: 2026-11-13
"""

from alembic import op

revision = "4e71a9c2f6b0"
down_revision = "c34ef633d962"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute("ALTER TYPE medical_assignment_status_enum ADD VALUE IF NOT EXISTS 'ready_for_pickup'")
    op.execute("ALTER TYPE medical_assignment_status_enum ADD VALUE IF NOT EXISTS 'released'")


def downgrade() -> None:
    # PostgreSQL enum values cannot be removed without rebuilding the enum type.
    pass
