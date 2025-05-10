# backend/routes/appointments.py

from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta
from app.core.database import get_db
from app.models import Appointment, Patient
from app.schemas import AppointmentCreate, Appointment as AppointmentSchema

router = APIRouter()

@router.get("/appointments", response_model=List[AppointmentSchema])
async def get_appointments(
    patient_id: Optional[str] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Obtiene la lista de citas.
    Opcionalmente filtra por paciente, rango de fechas y estado.
    """
    query = db.query(Appointment)
    
    if patient_id:
        query = query.filter(Appointment.patient_id == patient_id)
    
    if start_date:
        query = query.filter(Appointment.date_time >= start_date)
    
    if end_date:
        query = query.filter(Appointment.date_time <= end_date)
    
    if status:
        query = query.filter(Appointment.status == status)
    
    return query.order_by(Appointment.date_time).all()

@router.get("/appointments/{appointment_id}", response_model=AppointmentSchema)
async def get_appointment(
    appointment_id: str,
    db: Session = Depends(get_db)
):
    """
    Obtiene los detalles de una cita específica.
    """
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Cita no encontrada")
    return appointment

@router.post("/appointments", response_model=AppointmentSchema)
async def create_appointment(
    appointment_data: AppointmentCreate,
    db: Session = Depends(get_db)
):
    """
    Crea una nueva cita.
    """
    # Verificar que el paciente existe
    patient = db.query(Patient).filter(Patient.id == appointment_data.patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")
    
    # Verificar que no hay otra cita en el mismo horario
    existing_appointment = db.query(Appointment).filter(
        Appointment.date_time == appointment_data.date_time,
        Appointment.patient_id == appointment_data.patient_id
    ).first()
    
    if existing_appointment:
        raise HTTPException(
            status_code=400,
            detail="Ya existe una cita para este paciente en el horario especificado"
        )
    
    # Crear nueva cita
    db_appointment = Appointment(**appointment_data.model_dump())
    db.add(db_appointment)
    db.commit()
    db.refresh(db_appointment)
    return db_appointment

@router.put("/appointments/{appointment_id}", response_model=AppointmentSchema)
async def update_appointment(
    appointment_id: str,
    appointment_data: AppointmentCreate,
    db: Session = Depends(get_db)
):
    """
    Actualiza una cita existente.
    """
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Cita no encontrada")
    
    # Verificar que el paciente existe
    patient = db.query(Patient).filter(Patient.id == appointment_data.patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")
    
    # Verificar que no hay otra cita en el mismo horario (excluyendo la actual)
    existing_appointment = db.query(Appointment).filter(
        Appointment.date_time == appointment_data.date_time,
        Appointment.patient_id == appointment_data.patient_id,
        Appointment.id != appointment_id
    ).first()
    
    if existing_appointment:
        raise HTTPException(
            status_code=400,
            detail="Ya existe otra cita para este paciente en el horario especificado"
        )
    
    # Actualizar campos
    update_data = appointment_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(appointment, key, value)
    
    db.commit()
    db.refresh(appointment)
    return appointment

@router.delete("/appointments/{appointment_id}")
async def delete_appointment(
    appointment_id: str,
    db: Session = Depends(get_db)
):
    """
    Elimina una cita existente.
    """
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Cita no encontrada")
    
    db.delete(appointment)
    db.commit()
    return {"message": "Cita eliminada correctamente"}

@router.get("/appointments/upcoming", response_model=List[AppointmentSchema])
async def get_upcoming_appointments(
    days: int = Query(7, ge=1, le=30),
    db: Session = Depends(get_db)
):
    """
    Obtiene las citas próximas en los próximos N días.
    """
    end_date = datetime.now() + timedelta(days=days)
    return db.query(Appointment).filter(
        Appointment.date_time >= datetime.now(),
        Appointment.date_time <= end_date,
        Appointment.status == "scheduled"
    ).order_by(Appointment.date_time).all() 