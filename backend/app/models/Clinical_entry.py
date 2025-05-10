from datetime import datetime
from sqlalchemy import Column, String, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.utils.uuid import generate_uuid

class ClinicalEntry(Base):
    __tablename__ = "clinical_entries"

    id = Column(String, primary_key=True, default=generate_uuid)
    patient_id = Column(String, ForeignKey("patients.id"))
    date = Column(DateTime, nullable=False, default=datetime.now)
    type = Column(String, nullable=False)
    notes = Column(Text, nullable=False)
    created_by = Column(String)

    # Relaciones
    patient = relationship("Patient", back_populates="clinical_entries") 