from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base
import uuid

def generate_uuid():
    return str(uuid.uuid4())

class Session(Base):
    __tablename__ = "sessions"

    id = Column(String, primary_key=True, default=generate_uuid)
    patient_id = Column(String, ForeignKey("patients.id"), nullable=False)
    date = Column(DateTime, default=datetime.utcnow)
    audio_url = Column(String)
    transcript = Column(Text)
    summary = Column(Text)
    genogram_id = Column(String, ForeignKey("genograms.id"), nullable=True)
    summary_timestamp = Column(String, nullable=True)  # Ejemplo: '20240516123000'
    created_by = Column(String)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))  # ✅ CORREGIDO
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))  # ✅ CORREGIDO

    # Relaciones
    patient = relationship("Patient", back_populates="sessions")
    genogram = relationship("Genogram")
