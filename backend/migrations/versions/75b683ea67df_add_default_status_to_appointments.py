"""Add default status to appointments

Revision ID: 75b683ea67df
Revises: dd8227c9b4f5
Create Date: 2025-05-16 17:38:49.256153

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.sql import text


# revision identifiers, used by Alembic.
revision: str = '75b683ea67df'
down_revision: Union[str, None] = 'dd8227c9b4f5'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema - Actualiza los registros con status NULL a 'scheduled'."""
    # Actualizar todas las filas donde status es NULL a 'scheduled'
    op.execute(text("UPDATE appointments SET status = 'scheduled' WHERE status IS NULL"))


def downgrade() -> None:
    """Downgrade schema - No hay un downgrade para este cambio."""
    # No hay una forma de determinar qué filas tenían NULL antes
    pass
