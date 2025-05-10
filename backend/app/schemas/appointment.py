from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class AppointmentBase(BaseModel):
    date_time: datetime
    duration_minutes: int = 60
    notes: Optional[str] = None

class AppointmentCreate(AppointmentBase):
    patient_id: str

class Appointment(AppointmentBase):
    id: str
    patient_id: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True 