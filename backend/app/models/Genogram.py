from datetime import datetime
from sqlalchemy import Column, String, DateTime, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base

class Genogram(Base):
    __tablename__ = "genograms"

    id = Column(String, primary_key=True)
    patient_id = Column(String, ForeignKey("patients.id"))
    name = Column(String, nullable=True)  # Nombre del genograma
    description = Column(Text, nullable=True)  # Descripción
    thumbnail = Column(String, nullable=True)  # URL o ruta de la miniatura
    data = Column(JSON)
    notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    patient = relationship("Patient", back_populates="genograms")