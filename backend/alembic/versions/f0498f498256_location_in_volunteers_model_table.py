"""location in volunteers model / table

Revision ID: f0498f498256
Revises: 8d788ffe1d48
Create Date: 2026-11-10 09:56:54.695034
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "f0498f498256"
down_revision: Union[str, Sequence[str], None] = "8d788ffe1d48"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add volunteer location fields
    op.add_column(
        "volunteers", sa.Column("state", sa.String(length=100), nullable=False)
    )
    op.add_column(
        "volunteers", sa.Column("district", sa.String(length=100), nullable=False)
    )
    op.add_column(
        "volunteers", sa.Column("area_name", sa.String(length=150), nullable=False)
    )
    op.add_column(
        "volunteers", sa.Column("pincode", sa.String(length=10), nullable=False)
    )

    op.drop_column("volunteers", "service_area")


def downgrade() -> None:
    op.add_column(
        "volunteers", sa.Column("service_area", sa.String(length=100), nullable=True)
    )

    op.drop_column("volunteers", "pincode")
    op.drop_column("volunteers", "area_name")
    op.drop_column("volunteers", "district")
    op.drop_column("volunteers", "state")
