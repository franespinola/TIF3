from datetime import datetime
from typing import Dict, Any, Optional
from pydantic import BaseModel

# Base para crear o actualizar
class GenogramBase(BaseModel):
    data: Dict[str, Any]
    notes: Optional[str] = None
    name: Optional[str] = None
    description: Optional[str] = None
    thumbnail: Optional[str] = None

# Usado para creación desde frontend
class GenogramCreate(GenogramBase):
    patient_id: str

# Modelo completo (para endpoints que requieren todos los campos)
class Genogram(GenogramBase):
    id: str
    patient_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Modelo para vistas más detalladas, usado por ejemplo en listas
class GenogramWithPatientName(Genogram):
    patientName: str
    created: str
    lastModified: str

    class Config:
        from_attributes = True

# ✅ NUEVO: Modelo resumido para uso interno en sesiones
class GenogramSchema(BaseModel):
    id: str
    name: Optional[str] = None
    data: Dict[str, Any]
    notes: Optional[str] = None

    class Config:
        from_attributes = True
