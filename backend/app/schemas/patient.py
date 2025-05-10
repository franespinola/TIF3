from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr

class PatientBase(BaseModel):
    name: str
    age: int
    gender: str
    email: str
    phone: str
    address: Optional[str] = None
    emergency_contact: Optional[str] = None
    diagnosis: Optional[str] = None

class PatientCreate(PatientBase):
    pass

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

class Patient(PatientBase):
    id: str
    first_visit: datetime
    last_visit: Optional[datetime] = None
    notes: Optional[str] = None

    class Config:
        from_attributes = True 