"""test

Revision ID: 572a1aab7810
Revises: baeea7eb5d45
Create Date: 2025-06-02 20:09:19.612096

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '572a1aab7810'
down_revision: Union[str, None] = 'baeea7eb5d45'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
