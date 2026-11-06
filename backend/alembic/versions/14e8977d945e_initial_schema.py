"""initial schema

Revision ID: 14e8977d945e
Revises: 20261106a002
Create Date: 2026-11-06 10:44:58.248082

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '14e8977d945e'
down_revision: Union[str, Sequence[str], None] = '20261106a002'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Compatibility revision; the preceding baseline creates the schema."""
    pass


def downgrade() -> None:
    """No schema changes in this compatibility revision."""
    pass
