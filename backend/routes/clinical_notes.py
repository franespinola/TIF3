# backend/routes/clinical_notes.py

from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from app.core.database import get_db
from app.models import ClinicalEntry as ClinicalNote, Patient
from app.schemas import ClinicalEntryCreate as ClinicalNoteCreate, ClinicalEntry as ClinicalNoteSchema

router = APIRouter()

@router.get("/patients/{patient_id}/clinical-notes", response_model=List[ClinicalNoteSchema])
async def get_patient_clinical_notes(
    patient_id: str,
    type: Optional[str] = None,
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """
    Obtiene todas las notas clínicas de un paciente.
    Opcionalmente filtra por tipo de nota.
    """
    # Verificar que el paciente existe
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")
    
    # Construir query
    query = db.query(ClinicalNote).filter(ClinicalNote.patient_id == patient_id)
    if type:
        query = query.filter(ClinicalNote.type == type)
    
    # Ordenar por fecha y aplicar límite
    notes = query.order_by(ClinicalNote.date.desc()).limit(limit).all()
    return notes

@router.get("/patients/{patient_id}/clinical-notes/{note_id}", response_model=ClinicalNoteSchema)
async def get_clinical_note(
    patient_id: str,
    note_id: str,
    db: Session = Depends(get_db)
):
    """
    Obtiene una nota clínica específica.
    """
    note = db.query(ClinicalNote).filter(
        ClinicalNote.id == note_id,
        ClinicalNote.patient_id == patient_id
    ).first()
    
    if not note:
        raise HTTPException(status_code=404, detail="Nota clínica no encontrada")
    
    return note

@router.post("/patients/{patient_id}/clinical-notes", response_model=ClinicalNoteSchema)
async def create_clinical_note(
    patient_id: str,
    note_data: ClinicalNoteCreate,
    db: Session = Depends(get_db)
):
    """
    Crea una nueva nota clínica para un paciente.
    """
    # Verificar que el paciente existe
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")
    
    # Crear nueva nota
    db_note = ClinicalNote(**note_data.model_dump())
    db_note.patient_id = patient_id
    
    # Actualizar última visita del paciente
    patient.last_visit = datetime.now()
    
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    return db_note

@router.put("/patients/{patient_id}/clinical-notes/{note_id}", response_model=ClinicalNoteSchema)
async def update_clinical_note(
    patient_id: str,
    note_id: str,
    note_data: ClinicalNoteCreate,
    db: Session = Depends(get_db)
):
    """
    Actualiza una nota clínica existente.
    """
    note = db.query(ClinicalNote).filter(
        ClinicalNote.id == note_id,
        ClinicalNote.patient_id == patient_id
    ).first()
    
    if not note:
        raise HTTPException(status_code=404, detail="Nota clínica no encontrada")
    
    # Actualizar campos
    update_data = note_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(note, key, value)
    
    db.commit()
    db.refresh(note)
    return note

@router.delete("/patients/{patient_id}/clinical-notes/{note_id}")
async def delete_clinical_note(
    patient_id: str,
    note_id: str,
    db: Session = Depends(get_db)
):
    """
    Elimina una nota clínica existente.
    """
    note = db.query(ClinicalNote).filter(
        ClinicalNote.id == note_id,
        ClinicalNote.patient_id == patient_id
    ).first()
    
    if not note:
        raise HTTPException(status_code=404, detail="Nota clínica no encontrada")
    
    db.delete(note)
    db.commit()
    return {"message": "Nota clínica eliminada correctamente"}

@router.get("/clinical-note-types")
async def get_clinical_note_types():
    """
    Retorna los tipos de notas clínicas disponibles en el sistema.
    """
    # Tipos predefinidos de notas clínicas
    note_types = [
        {"id": "session", "name": "Nota de Sesión", "description": "Registro de una sesión terapéutica"},
        {"id": "intake", "name": "Evaluación Inicial", "description": "Primera evaluación del paciente"},
        {"id": "diagnosis", "name": "Diagnóstico", "description": "Determinación diagnóstica"},
        {"id": "plan", "name": "Plan de Tratamiento", "description": "Planificación de intervenciones"},
        {"id": "progress", "name": "Nota de Progreso", "description": "Evolución del paciente"},
        {"id": "medication", "name": "Medicación", "description": "Registro de medicamentos"},
        {"id": "referral", "name": "Derivación", "description": "Referencia a otro profesional"},
        {"id": "closure", "name": "Cierre de Caso", "description": "Finalización del tratamiento"}
    ]
    
    return {"note_types": note_types}