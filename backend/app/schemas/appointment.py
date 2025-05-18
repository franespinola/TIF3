from datetime import datetime
from typing import Optional
from pydantic import BaseModel
from enum import Enum

# Enums para tipo y estado
class AppointmentStatus(str, Enum):
    scheduled = "scheduled"
    confirmed = "confirmed"
    rescheduled = "rescheduled"
    in_progress = "in_progress"
    completed = "completed"
    cancelled = "cancelled"
    no_show = "no_show"

class AppointmentType(str, Enum):
    sesion_familiar = "sesion_familiar"
    primera_sesion_familiar = "primera_sesion_familiar"
    consulta = "consulta"
    consulta_familiar = "consulta_familiar"
    seguimiento = "seguimiento"
    emergencia = "emergencia"

# Base
class AppointmentBase(BaseModel):
    date_time: datetime
    duration_minutes: int = 60
    notes: Optional[str] = None
    status: AppointmentStatus = AppointmentStatus.scheduled
    type: Optional[AppointmentType] = AppointmentType.consulta  # Ahora es opcional con valor predeterminado

# Para crear
class AppointmentCreate(AppointmentBase):
    patient_id: str

# Para devolver al frontend
class Appointment(AppointmentBase):
    id: str
    patient_id: str
    created_at: datetime
    patientName: Optional[str] = None

    class Config:
        from_attributes = True
        use_enum_values = True  # <--- devuelve los enums como strings
