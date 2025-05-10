from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class RecordingBase(BaseModel):
    file_path: str
    duration_seconds: int

class RecordingCreate(RecordingBase):
    patient_id: str

class Recording(RecordingBase):
    id: str
    patient_id: str
    created_at: datetime
    transcription_path: Optional[str] = None

    class Config:
        from_attributes = True

class TranscriptionBase(BaseModel):
    content: str

class TranscriptionCreate(TranscriptionBase):
    recording_id: str

class Transcription(TranscriptionBase):
    id: str
    recording_id: str
    created_at: datetime

    class Config:
        from_attributes = True 