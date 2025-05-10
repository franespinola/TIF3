from datetime import datetime
from typing import Dict, Any
from pydantic import BaseModel

class GenogramBase(BaseModel):
    name: str
    data: Dict[str, Any]

class GenogramCreate(GenogramBase):
    patient_id: str

class Genogram(GenogramBase):
    id: str
    patient_id: str
    created_at: datetime
    last_modified: datetime

    class Config:
        from_attributes = True 