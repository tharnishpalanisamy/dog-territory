"""Normalize medical assignment volunteer ids to user ids.

Revision ID: 4b7a91c2de30
Revises: 15cf87df2b8e
Create Date: 2026-11-14
"""

from alembic import op

revision = "4b7a91c2de30"
down_revision = "15cf87df2b8e"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Older assignment creation code stored the volunteer profile primary key
    # in a column whose foreign key and application contract use users.id.
    # Only normalize rows where the creator confirms the profile owner.
    op.execute(
        """
        UPDATE medical_assignments AS assignment
        SET volunteer_id = volunteer.user_id
        FROM volunteers AS volunteer
        WHERE assignment.volunteer_id = volunteer.id
          AND assignment.created_by = volunteer.user_id
          AND volunteer.id <> volunteer.user_id
        """
    )


def downgrade() -> None:
    # Keep the column's established contract: volunteer_id references users.id.
    # Reversing the data normalization would restore profile IDs in a user FK.
    pass
