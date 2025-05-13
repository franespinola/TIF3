from datetime import datetime
from typing import Dict, Any, Optional
from pydantic import BaseModel

class GenogramBase(BaseModel):
    data: Dict[str, Any]
    notes: Optional[str] = None

class GenogramCreate(GenogramBase):
    patient_id: str

class Genogram(GenogramBase):
    id: str
    patient_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True