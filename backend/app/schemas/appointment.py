from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field

class AppointmentBase(BaseModel):
    date_time: datetime
    duration_minutes: int = 60
    notes: Optional[str] = None
    status: Optional[str] = "scheduled"

class AppointmentCreate(AppointmentBase):
    patient_id: str

class Appointment(AppointmentBase):
    id: str
    patient_id: str
    status: str
    created_at: datetime
    patientName: Optional[str] = None

    class Config:
        from_attributes = True 
        extra = "allow" 