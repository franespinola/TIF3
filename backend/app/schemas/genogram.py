from datetime import datetime
from typing import Dict, Any, Optional
from pydantic import BaseModel

class GenogramBase(BaseModel):
    data: Dict[str, Any]
    notes: Optional[str] = None
    name: Optional[str] = None
    description: Optional[str] = None
    thumbnail: Optional[str] = None

class GenogramCreate(GenogramBase):
    patient_id: str

class Genogram(GenogramBase):
    id: str
    patient_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
        
class GenogramWithPatientName(Genogram):
    patientName: str
    created: str  # Para formato compatible con frontend (YYYY-MM-DD)
    lastModified: str  # Para formato compatible con frontend (YYYY-MM-DD)