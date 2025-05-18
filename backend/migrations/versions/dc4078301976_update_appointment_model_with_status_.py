"""update appointment model with status and type enums

Revision ID: dc4078301976
Revises: 6426373e22f8
Create Date: 2025-05-18 13:52:05.183716
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'dc4078301976'
down_revision: Union[str, None] = '6426373e22f8'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    with op.batch_alter_table('appointments', schema=None) as batch_op:
        batch_op.add_column(sa.Column(
            'type',
            sa.Enum(
                'sesion_familiar',
                'primera_sesion_familiar',
                'consulta',
                'consulta_familiar',
                'seguimiento',
                'emergencia',
                name='appointmenttype'
            ),
            nullable=False,
            server_default='consulta'  # ⚠️ valor temporal para filas existentes
        ))
        batch_op.alter_column('patient_id',
               existing_type=sa.VARCHAR(),
               nullable=False)
        batch_op.alter_column('status',
               existing_type=sa.VARCHAR(),
               nullable=False)


def downgrade() -> None:
    """Downgrade schema."""
    with op.batch_alter_table('appointments', schema=None) as batch_op:
        batch_op.alter_column('status',
               existing_type=sa.VARCHAR(),
               nullable=True)
        batch_op.alter_column('patient_id',
               existing_type=sa.VARCHAR(),
               nullable=True)
        batch_op.drop_column('type')
