from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, EmailStr

# Modelos para la gestión de pacientes
class PatientBase(BaseModel):
    name: str
    age: int
    gender: str
    email: str  # Idealmente EmailStr, pero mantenemos str por simplicidad
    phone: str
    address: Optional[str] = None
    emergency_contact: Optional[str] = None
    diagnosis: Optional[str] = None

class PatientCreate(PatientBase):
    pass

class Patient(PatientBase):
    id: str
    first_visit: datetime
    last_visit: Optional[datetime] = None
    notes: Optional[str] = None
    
    class Config:
        from_attributes = True

class PatientUpdate(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    emergency_contact: Optional[str] = None
    diagnosis: Optional[str] = None
    notes: Optional[str] = None
    last_visit: Optional[datetime] = None

# Modelos para medicaciones
class Medication(BaseModel):
    name: str
    dosage: str
    frequency: str
    start_date: datetime
    end_date: Optional[datetime] = None
    notes: Optional[str] = None
    patient_id: str

# Modelos para historia clínica
class ClinicalEntry(BaseModel):
    id: str
    patient_id: str
    date: datetime
    type: str
    notes: str
    created_by: Optional[str] = None

class ClinicalEntryCreate(BaseModel):
    patient_id: str
    type: str
    notes: str
    date: Optional[datetime] = None

# Modelos para genogramas
class GenogramBase(BaseModel):
    patient_id: str
    name: str

class GenogramCreate(GenogramBase):
    data: Dict[str, Any]  # Contendrá el JSON del genograma

class Genogram(GenogramBase):
    id: str
    created_at: datetime
    last_modified: datetime
    data: Dict[str, Any]  # Contendrá el JSON del genograma

# Modelos para citas
class Appointment(BaseModel):
    id: str
    patient_id: str
    date_time: datetime
    duration_minutes: int = 60
    notes: Optional[str] = None
    status: str = "scheduled"  # scheduled, completed, cancelled, etc.

class AppointmentCreate(BaseModel):
    patient_id: str
    date_time: datetime
    duration_minutes: Optional[int] = 60
    notes: Optional[str] = None

# Modelos para grabación y transcripción
class Recording(BaseModel):
    id: str
    patient_id: str
    file_path: str
    duration_seconds: int
    created_at: datetime
    transcription_path: Optional[str] = None

class Transcription(BaseModel):
    id: str
    recording_id: str
    content: str
    created_at: datetime