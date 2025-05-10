from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class GenogramBase(BaseModel):
    patient_id: str
    data: dict
    notes: Optional[str] = None

class GenogramCreate(GenogramBase):
    pass

class Genogram(GenogramBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True 