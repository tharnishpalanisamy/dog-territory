from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "3c99b071b7b9"
down_revision: str | Sequence[str] | None = "5d7a2b9c1e04"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


approval_enum = sa.Enum(
    "pending",
    "approved",
    "rejected",
    name="volunteer_approval_enum",
)


def upgrade() -> None:
    bind = op.get_bind()

    approval_enum.create(bind, checkfirst=True)

    op.alter_column(
        "volunteers",
        "approval_status",
        existing_type=sa.VARCHAR(length=20),
        type_=approval_enum,
        existing_nullable=False,
        postgresql_using="approval_status::text::volunteer_approval_enum",
    )


def downgrade() -> None:
    op.alter_column(
        "volunteers",
        "approval_status",
        existing_type=approval_enum,
        type_=sa.VARCHAR(length=20),
        existing_nullable=False,
        postgresql_using="approval_status::text",
    )

    approval_enum.drop(op.get_bind(), checkfirst=True)
