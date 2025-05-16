from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session as DbSession
from sqlalchemy.orm import joinedload
from typing import List
from app.core.database import get_db
from app.models import Session, Patient, Genogram
from app.schemas.session import Session as SessionSchema, SessionCreate, SessionUpdate, SessionWithDetails
from app.schemas.genogram import Genogram as GenogramSchema

router = APIRouter()

@router.get("/sessions", response_model=List[SessionSchema])
def get_sessions(
    skip: int = Query(0, description="Number of records to skip"),
    limit: int = Query(100, description="Max number of records to return"),
    db: DbSession = Depends(get_db)
):
    """
    Retrieve all clinical sessions, ordered by date (most recent first)
    """
    sessions = db.query(Session).order_by(Session.date.desc()).offset(skip).limit(limit).all()
    return sessions

@router.get("/sessions/{session_id}", response_model=SessionWithDetails)
def get_session(session_id: str, db: DbSession = Depends(get_db)):
    """
    Retrieve a specific clinical session with details
    """
    # Get the session with joined genogram and patient
    session = db.query(Session).options(
        joinedload(Session.genogram),
        joinedload(Session.patient)
    ).filter(Session.id == session_id).first()
    
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    # Create response with detailed information
    response = SessionWithDetails.from_orm(session)
    
    # Add genogram data if available
    if session.genogram:
        response.genogram = {
            "id": session.genogram.id,
            "name": session.genogram.name,
            "data": session.genogram.data,
            "notes": session.genogram.notes
        }
    
    # Add patient data
    if session.patient:
        response.patient_info = {
            "id": session.patient.id,
            "name": session.patient.name,
            "age": session.patient.age,
            "gender": session.patient.gender,
            "email": session.patient.email
        }
    
    return response

@router.post("/sessions", response_model=SessionSchema)
def create_session(session: SessionCreate, db: DbSession = Depends(get_db)):
    """
    Create a new clinical session
    """
    # Verify patient exists
    patient = db.query(Patient).filter(Patient.id == session.patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    # Verify genogram exists if provided
    if session.genogram_id:
        genogram = db.query(Genogram).filter(Genogram.id == session.genogram_id).first()
        if not genogram:
            raise HTTPException(status_code=404, detail="Genogram not found")
    
    # Create session
    db_session = Session(**session.dict())
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    
    return db_session

@router.put("/sessions/{session_id}", response_model=SessionSchema)
def update_session(session_id: str, session_update: SessionUpdate, db: DbSession = Depends(get_db)):
    """
    Update an existing clinical session
    """
    # Get the session
    db_session = db.query(Session).filter(Session.id == session_id).first()
    if not db_session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    # Update fields
    update_data = session_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_session, field, value)
    
    db.commit()
    db.refresh(db_session)
    
    return db_session

@router.delete("/sessions/{session_id}", response_model=dict)
def delete_session(session_id: str, db: DbSession = Depends(get_db)):
    """
    Delete a clinical session
    """
    db_session = db.query(Session).filter(Session.id == session_id).first()
    if not db_session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    db.delete(db_session)
    db.commit()
    
    return {"message": "Session deleted successfully"}

@router.get("/patients/{patient_id}/sessions", response_model=List[SessionSchema])
def get_sessions_by_patient(patient_id: str, db: DbSession = Depends(get_db)):
    """
    Devuelve todas las sesiones clínicas asociadas a un paciente.
    """
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")

    sessions = db.query(Session).filter(Session.patient_id == patient_id).order_by(Session.date.desc()).all()
    return sessions

