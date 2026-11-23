"""add user phone number

Revision ID: fd12a8b949ab
Revises: ee2932233fb7
Create Date: 2026-11-23

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "fd12a8b949ab"
down_revision: Union[str, Sequence[str], None] = "ee2932233fb7"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("users", sa.Column("phone_number", sa.String(length=20), nullable=True))


def downgrade() -> None:
    op.drop_column("users", "phone_number")
