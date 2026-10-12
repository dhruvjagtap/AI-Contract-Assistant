"""add timestamp defaults to users

Revision ID: 655a48f481b2
Revises: 5b1bed66e6ba
Create Date: 2026-08-03 00:12:36.180507

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '655a48f481b2'
down_revision: Union[str, Sequence[str], None] = '5b1bed66e6ba'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.alter_column(
        "users",
        "created_at",
        server_default=sa.func.now(),
        existing_type=sa.DateTime(),
        nullable=False,
    )

    op.alter_column(
        "users",
        "updated_at",
        server_default=sa.func.now(),
        existing_type=sa.DateTime(),
        nullable=False,
    )


def downgrade() -> None:
    op.alter_column(
        "users",
        "created_at",
        server_default=None,
        existing_type=sa.DateTime(),
        nullable=False,
    )

    op.alter_column(
        "users",
        "updated_at",
        server_default=None,
        existing_type=sa.DateTime(),
        nullable=False,
    )