"""initial schema

Revision ID: 20261106a002
Revises: 533e76b1696e
Create Date: 2026-11-06 12:13:28.493581

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '20261106a002'
down_revision: Union[str, Sequence[str], None] = '533e76b1696e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Compatibility revision; the preceding baseline creates the schema."""
    pass


def downgrade() -> None:
    """No schema changes in this compatibility revision."""
    pass


