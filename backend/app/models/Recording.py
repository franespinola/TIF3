from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.utils.uuid import generate_uuid

class Recording(Base):
    __tablename__ = "recordings"

    id = Column(String, primary_key=True, default=generate_uuid)
    patient_id = Column(String, ForeignKey("patients.id"))
    file_path = Column(String, nullable=False)
    duration_seconds = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.now)
    transcription_path = Column(String)

    # Relaciones
    patient = relationship("Patient", back_populates="recordings")
    transcription = relationship("Transcription", back_populates="recording", uselist=False)

class Transcription(Base):
    __tablename__ = "transcriptions"

    id = Column(String, primary_key=True, default=generate_uuid)
    recording_id = Column(String, ForeignKey("recordings.id"))
    content = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.now)

    # Relaciones
    recording = relationship("Recording", back_populates="transcription") 