from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class ClinicalEntryBase(BaseModel):
    type: str
    notes: str
    date: Optional[datetime] = None

class ClinicalEntryCreate(ClinicalEntryBase):
    patient_id: str

class ClinicalEntry(ClinicalEntryBase):
    id: str
    patient_id: str
    created_by: Optional[str] = None

    class Config:
        from_attributes = True 