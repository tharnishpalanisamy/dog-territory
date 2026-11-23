"""changed column name from location to landmark in reports

Revision ID: 890f88ff8473
Revises: 88c2fee29761
Create Date: 2026-11-23 17:45:10.893695
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "890f88ff8473"
down_revision: str | Sequence[str] | None = "88c2fee29761"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.alter_column(
        "reports",
        "location",
        new_column_name="landmark",
        existing_type=sa.Text(),
        existing_nullable=False,
    )


def downgrade() -> None:
    op.alter_column(
        "reports",
        "landmark",
        new_column_name="location",
        existing_type=sa.Text(),
        existing_nullable=False,
    )
