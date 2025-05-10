# backend/routes/patients.py

from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.models import Patient, Medication, Appointment
from app.schemas import (
    PatientCreate, 
    PatientUpdate, 
    Patient as PatientSchema, 
    MedicationCreate, 
    Medication as MedicationSchema,
    AppointmentCreate,
    Appointment as AppointmentSchema
)

router = APIRouter()

@router.get("/patients", response_model=List[PatientSchema])
async def get_patients(
    name: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Obtiene la lista de todos los pacientes.
    Opcionalmente filtra por nombre.
    """
    query = db.query(Patient)
    if name:
        query = query.filter(Patient.name.ilike(f"%{name}%"))
    return query.all()

@router.get("/patients/{patient_id}", response_model=PatientSchema)
async def get_patient(
    patient_id: str,
    db: Session = Depends(get_db)
):
    """
    Obtiene los datos de un paciente específico por su ID.
    """
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")
    return patient

@router.post("/patients", response_model=PatientSchema)
async def create_patient(
    patient_data: PatientCreate,
    db: Session = Depends(get_db)
):
    """
    Crea un nuevo paciente.
    """
    db_patient = Patient(**patient_data.model_dump())
    db.add(db_patient)
    db.commit()
    db.refresh(db_patient)
    return db_patient

@router.put("/patients/{patient_id}", response_model=PatientSchema)
async def update_patient(
    patient_id: str,
    patient_data: PatientUpdate,
    db: Session = Depends(get_db)
):
    """
    Actualiza los datos de un paciente existente.
    """
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")
    
    # Actualizar solo los campos proporcionados
    update_data = patient_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(patient, key, value)
    
    db.commit()
    db.refresh(patient)
    return patient

@router.delete("/patients/{patient_id}")
async def delete_patient(
    patient_id: str,
    db: Session = Depends(get_db)
):
    """
    Elimina un paciente existente.
    """
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")
    
    db.delete(patient)
    db.commit()
    return {"message": "Paciente eliminado correctamente"}

@router.get("/patients/{patient_id}/medications", response_model=List[MedicationSchema])
async def get_patient_medications(
    patient_id: str,
    db: Session = Depends(get_db)
):
    """
    Obtiene las medicaciones de un paciente específico.
    """
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")
    
    return patient.medications

@router.post("/patients/{patient_id}/medications", response_model=MedicationSchema)
async def add_patient_medication(
    patient_id: str,
    medication_data: MedicationCreate,
    db: Session = Depends(get_db)
):
    """
    Añade una nueva medicación a un paciente.
    """
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")
    
    db_medication = Medication(**medication_data.model_dump())
    db.add(db_medication)
    db.commit()
    db.refresh(db_medication)
    return db_medication

@router.get("/patients/{patient_id}/appointments", response_model=List[AppointmentSchema])
async def get_patient_appointments(
    patient_id: str,
    db: Session = Depends(get_db)
):
    """
    Obtiene las citas de un paciente específico.
    """
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")
    
    return patient.appointments

@router.post("/patients/{patient_id}/appointments", response_model=AppointmentSchema)
async def create_patient_appointment(
    patient_id: str,
    appointment_data: AppointmentCreate,
    db: Session = Depends(get_db)
):
    """
    Crea una nueva cita para un paciente.
    """
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")
    
    db_appointment = Appointment(**appointment_data.model_dump())
    db.add(db_appointment)
    db.commit()
    db.refresh(db_appointment)
    return db_appointment