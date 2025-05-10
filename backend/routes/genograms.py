# backend/routes/genograms.py

from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database_config import get_db
from app.models import Genogram, Patient
from app.schemas import GenogramCreate, Genogram as GenogramSchema

router = APIRouter()

@router.get("/genograms", response_model=List[GenogramSchema])
async def get_genograms(
    patient_id: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Obtiene la lista de todos los genogramas.
    Opcionalmente filtra por paciente.
    """
    query = db.query(Genogram)
    if patient_id:
        query = query.filter(Genogram.patient_id == patient_id)
    return query.all()

@router.get("/genograms/{genogram_id}", response_model=GenogramSchema)
async def get_genogram(
    genogram_id: str,
    db: Session = Depends(get_db)
):
    """
    Obtiene los datos de un genograma específico por su ID.
    """
    genogram = db.query(Genogram).filter(Genogram.id == genogram_id).first()
    if not genogram:
        raise HTTPException(status_code=404, detail="Genograma no encontrado")
    return genogram

@router.post("/genograms", response_model=GenogramSchema)
async def create_genogram(
    genogram_data: GenogramCreate,
    db: Session = Depends(get_db)
):
    """
    Crea un nuevo genograma.
    """
    # Verificar que el paciente existe
    patient = db.query(Patient).filter(Patient.id == genogram_data.patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")
    
    # Crear nuevo genograma
    db_genogram = Genogram(**genogram_data.model_dump())
    db.add(db_genogram)
    db.commit()
    db.refresh(db_genogram)
    return db_genogram

@router.put("/genograms/{genogram_id}", response_model=GenogramSchema)
async def update_genogram(
    genogram_id: str,
    genogram_data: GenogramCreate,
    db: Session = Depends(get_db)
):
    """
    Actualiza los datos de un genograma existente.
    """
    genogram = db.query(Genogram).filter(Genogram.id == genogram_id).first()
    if not genogram:
        raise HTTPException(status_code=404, detail="Genograma no encontrado")
    
    # Actualizar campos
    update_data = genogram_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(genogram, key, value)
    
    db.commit()
    db.refresh(genogram)
    return genogram

@router.delete("/genograms/{genogram_id}")
async def delete_genogram(
    genogram_id: str,
    db: Session = Depends(get_db)
):
    """
    Elimina un genograma existente.
    """
    genogram = db.query(Genogram).filter(Genogram.id == genogram_id).first()
    if not genogram:
        raise HTTPException(status_code=404, detail="Genograma no encontrado")
    
    db.delete(genogram)
    db.commit()
    return {"message": "Genograma eliminado correctamente"}

@router.get("/patients/{patient_id}/genograms", response_model=List[GenogramSchema])
async def get_patient_genograms(
    patient_id: str,
    db: Session = Depends(get_db)
):
    """
    Obtiene los genogramas de un paciente específico.
    """
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")
    
    return patient.genograms