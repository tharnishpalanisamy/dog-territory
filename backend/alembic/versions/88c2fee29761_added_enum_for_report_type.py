"""added enum for report type

Revision ID: 88c2fee29761
Revises: 70363f9ccd51
Create Date: 2026-11-23 17:20:26.897352
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = "88c2fee29761"
down_revision: Union[str, Sequence[str], None] = "70363f9ccd51"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


report_type_enum = postgresql.ENUM(
    "aggressive",
    "sick",
    "injured",
    "uncollared",
    "deceased",
    "other",
    name="report_type",
    create_type=False,
)


def upgrade() -> None:
    # 1. Create PostgreSQL ENUM type
    report_type_enum.create(op.get_bind(), checkfirst=True)

    # 2. Convert VARCHAR column to ENUM
    op.alter_column(
        "reports",
        "report_type",
        existing_type=sa.VARCHAR(length=50),
        type_=report_type_enum,
        existing_nullable=False,
        postgresql_using="report_type::report_type",
    )


def downgrade() -> None:
    # 1. Convert ENUM column back to VARCHAR
    op.alter_column(
        "reports",
        "report_type",
        existing_type=report_type_enum,
        type_=sa.VARCHAR(length=50),
        existing_nullable=False,
        postgresql_using="report_type::varchar",
    )

    # 2. Drop PostgreSQL ENUM type
    report_type_enum.drop(op.get_bind(), checkfirst=True)
