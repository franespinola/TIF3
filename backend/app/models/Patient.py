from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base
import uuid

def generate_uuid():
    return str(uuid.uuid4())

class Patient(Base):
    __tablename__ = "patients"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    age = Column(Integer, nullable=False)
    gender = Column(String, nullable=False)
    email = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    address = Column(String)
    emergency_contact = Column(String)
    diagnosis = Column(Text)
    first_visit = Column(DateTime, default=datetime.now)
    last_visit = Column(DateTime)
    notes = Column(Text)
    birth_date = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relaciones
    medications = relationship("Medication", back_populates="patient")
    clinical_entries = relationship("ClinicalEntry", back_populates="patient")
    appointments = relationship("Appointment", back_populates="patient")
    genograms = relationship("Genogram", back_populates="patient")

class Medication(Base):
    __tablename__ = "medications"

    id = Column(String, primary_key=True)
    patient_id = Column(String, ForeignKey("patients.id"))
    name = Column(String, nullable=False)
    dosage = Column(String)
    frequency = Column(String)
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    patient = relationship("Patient", back_populates="medications")