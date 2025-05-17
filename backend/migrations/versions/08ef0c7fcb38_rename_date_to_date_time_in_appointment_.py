"""Rename date to date_time in Appointment model

Revision ID: 08ef0c7fcb38
Revises: 
Create Date: 2025-05-16 17:30:33.647374

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.engine import Connection


# revision identifiers, used by Alembic.
revision: str = '08ef0c7fcb38'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema - Renombra la columna 'date' a 'date_time' preservando los datos."""
    # Para SQLite, no podemos renombrar columnas directamente, así que usamos este enfoque
    
    # Primero, creamos una tabla temporal con la estructura deseada
    op.execute('''
    CREATE TABLE appointments_temp (
        id VARCHAR NOT NULL, 
        patient_id VARCHAR, 
        date_time DATETIME NOT NULL, 
        status VARCHAR, 
        notes TEXT, 
        created_at DATETIME, 
        updated_at DATETIME, 
        PRIMARY KEY (id), 
        FOREIGN KEY(patient_id) REFERENCES patients (id)
    )
    ''')
    
    # Copiamos los datos de la tabla vieja a la nueva, renombrando las columnas
    op.execute('''
    INSERT INTO appointments_temp 
    SELECT id, patient_id, date, status, notes, created_at, updated_at 
    FROM appointments
    ''')
    
    # Eliminamos la tabla vieja
    op.execute('DROP TABLE appointments')
    
    # Renombramos la tabla temporal a la original
    op.execute('ALTER TABLE appointments_temp RENAME TO appointments')


def downgrade() -> None:
    """Downgrade schema - Revierte el cambio renombrando 'date_time' a 'date'."""
    # Para SQLite, el proceso es similar pero a la inversa
    
    # Primero, creamos una tabla temporal con la estructura antigua
    op.execute('''
    CREATE TABLE appointments_temp (
        id VARCHAR NOT NULL, 
        patient_id VARCHAR, 
        date DATETIME NOT NULL, 
        status VARCHAR, 
        notes TEXT, 
        created_at DATETIME, 
        updated_at DATETIME, 
        PRIMARY KEY (id), 
        FOREIGN KEY(patient_id) REFERENCES patients (id)
    )
    ''')
    
    # Copiamos los datos de la tabla actual a la temporal, renombrando las columnas
    op.execute('''
    INSERT INTO appointments_temp 
    SELECT id, patient_id, date_time, status, notes, created_at, updated_at 
    FROM appointments
    ''')
    
    # Eliminamos la tabla actual
    op.execute('DROP TABLE appointments')
    
    # Renombramos la tabla temporal a la original
    op.execute('ALTER TABLE appointments_temp RENAME TO appointments')
