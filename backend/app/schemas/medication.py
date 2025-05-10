from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class MedicationBase(BaseModel):
    name: str
    dosage: str
    frequency: str
    start_date: datetime
    end_date: Optional[datetime] = None
    notes: Optional[str] = None

class MedicationCreate(MedicationBase):
    patient_id: str

class Medication(MedicationBase):
    id: str
    patient_id: str

    class Config:
        from_attributes = True 