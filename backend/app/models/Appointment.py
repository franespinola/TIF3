from datetime import datetime
import uuid
from sqlalchemy import Column, String, DateTime, Text, ForeignKey, Integer, Enum
from sqlalchemy.orm import relationship
from app.core.database import Base
import enum

# Función para generar UUIDs para las citas
def generate_uuid():
    return str(uuid.uuid4())

# Estado de la cita
class AppointmentStatus(str, enum.Enum):
    scheduled = "scheduled"       # Cita agendada
    confirmed = "confirmed"       # Confirmada por el paciente
    rescheduled = "rescheduled"   # Reprogramada
    in_progress = "in_progress"   # En consulta
    completed = "completed"       # Finalizada
    cancelled = "cancelled"       # Cancelada
    no_show = "no_show"           # El paciente no se presentó

# Tipo de cita
class AppointmentType(str, enum.Enum):
    sesion_familiar = "sesion_familiar"
    primera_sesion_familiar = "primera_sesion_familiar"
    consulta = "consulta"
    consulta_familiar = "consulta_familiar"
    seguimiento = "seguimiento"
    emergencia = "emergencia"

class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(String, primary_key=True, default=generate_uuid)
    patient_id = Column(String, ForeignKey("patients.id"), nullable=False)
    date_time = Column(DateTime, nullable=False)
    duration_minutes = Column(Integer, default=60)

    status = Column(Enum(AppointmentStatus), default=AppointmentStatus.scheduled, nullable=False)
    type = Column(Enum(AppointmentType), nullable=False)

    notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    patient = relationship("Patient", back_populates="appointments")
