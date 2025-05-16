from datetime import datetime
from typing import Optional, Dict, Any
from pydantic import BaseModel
from app.schemas.genogram import Genogram as GenogramSchema


class SessionBase(BaseModel):
    patient_id: str
    audio_url: Optional[str] = None
    transcript: Optional[str] = None
    summary: Optional[str] = None
    genogram_id: Optional[str] = None
    created_by: Optional[str] = None
    summary_timestamp: Optional[str] = None  # ⬅️ Agregado

class SessionCreate(SessionBase):
    pass

class SessionUpdate(BaseModel):
    audio_url: Optional[str] = None
    transcript: Optional[str] = None
    summary: Optional[str] = None
    genogram_id: Optional[str] = None
    created_by: Optional[str] = None
    summary_timestamp: Optional[str] = None  # ⬅️ También aquí (si lo querés actualizar)

class Session(SessionBase):
    id: str
    date: datetime
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class SessionWithDetails(Session):
    genogram: Optional[GenogramSchema] = None
    patient_info: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True
