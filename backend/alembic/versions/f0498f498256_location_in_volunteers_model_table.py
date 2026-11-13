"""location in volunteers model / table

Revision ID: f0498f498256
Revises: 8d788ffe1d48
Create Date: 2026-11-10 09:56:54.695034
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

# Revision identifiers
revision: str = "f0498f498256"
down_revision: str | Sequence[str] | None = "8d788ffe1d48"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    # Add volunteer location fields
    op.add_column(
        "volunteers", sa.Column("state", sa.String(length=100), nullable=True)
    )

    op.add_column(
        "volunteers",
        sa.Column("district", sa.String(length=100), nullable=True),
    )

    op.add_column(
        "volunteers",
        sa.Column("area_name", sa.String(length=150), nullable=True),
    )

    op.add_column(
        "volunteers",
        sa.Column("pincode", sa.String(length=10), nullable=True),
    )

    # These columns are required by the ORM. Keep the migration compatible with
    # existing volunteer rows, which cannot be populated from service_area reliably.
    op.execute("UPDATE volunteers SET state = 'Unknown' WHERE state IS NULL")
    op.execute("UPDATE volunteers SET district = 'Unknown' WHERE district IS NULL")
    op.execute("UPDATE volunteers SET area_name = service_area WHERE area_name IS NULL")
    op.execute("UPDATE volunteers SET area_name = 'Unknown' WHERE area_name IS NULL")
    op.execute("UPDATE volunteers SET pincode = '000000' WHERE pincode IS NULL")

    op.alter_column("volunteers", "state", nullable=False)
    op.alter_column("volunteers", "district", nullable=False)
    op.alter_column("volunteers", "area_name", nullable=False)
    op.alter_column("volunteers", "pincode", nullable=False)

    # Remove old service_area column
    op.drop_column("volunteers", "service_area")


def downgrade() -> None:
    # Restore old service_area column
    op.add_column(
        "volunteers",
        sa.Column("service_area", sa.String(length=100), nullable=True),
    )

    # Remove new location fields
    op.drop_column("volunteers", "pincode")
    op.drop_column("volunteers", "area_name")
    op.drop_column("volunteers", "district")
    op.drop_column("volunteers", "state")
