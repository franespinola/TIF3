# backend/routes/clinical_notes.py

from fastapi import APIRouter, HTTPException, Path, Query
from typing import List, Optional, Dict, Any
from datetime import datetime
import os
import json

router = APIRouter()

# Directorios para almacenar las notas clínicas
DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")
CLINICAL_DIR = os.path.join(DATA_DIR, "clinical")
PATIENTS_DIR = os.path.join(DATA_DIR, "patients")

# Asegurar que los directorios existan
os.makedirs(CLINICAL_DIR, exist_ok=True)
os.makedirs(PATIENTS_DIR, exist_ok=True)

def _generate_id():
    """Genera un ID único basado en UUID"""
    from uuid import uuid4
    return str(uuid4())

def _get_patient_directory(patient_id):
    """Obtiene el directorio para notas clínicas de un paciente específico"""
    return os.path.join(CLINICAL_DIR, patient_id)

def _save_clinical_note(patient_id, note_data):
    """Guarda una nota clínica en su archivo JSON"""
    # Asegurar que existe el directorio para el paciente
    patient_dir = _get_patient_directory(patient_id)
    os.makedirs(patient_dir, exist_ok=True)
    
    # Asignar un ID si no tiene
    note_id = note_data.get("id")
    if not note_id:
        note_id = _generate_id()
        note_data["id"] = note_id
    
    # Asegurar campos obligatorios
    if "patient_id" not in note_data:
        note_data["patient_id"] = patient_id
        
    if "date" not in note_data:
        note_data["date"] = datetime.now().isoformat()
    
    if "created_at" not in note_data:
        note_data["created_at"] = datetime.now().isoformat()
        
    note_data["last_modified"] = datetime.now().isoformat()
    
    # Guardar nota
    file_path = os.path.join(patient_dir, f"{note_id}.json")
    with open(file_path, "w", encoding='utf-8') as f:
        json.dump(note_data, f, default=str, indent=2, ensure_ascii=False)
        
    return note_data

def _load_clinical_note(patient_id, note_id):
    """Carga una nota clínica desde su archivo JSON"""
    patient_dir = _get_patient_directory(patient_id)
    file_path = os.path.join(patient_dir, f"{note_id}.json")
    
    if not os.path.exists(file_path):
        return None
        
    with open(file_path, "r", encoding='utf-8') as f:
        return json.load(f)

def _load_patient_clinical_notes(patient_id):
    """Carga todas las notas clínicas de un paciente"""
    patient_dir = _get_patient_directory(patient_id)
    
    if not os.path.exists(patient_dir):
        return []
        
    notes = []
    for filename in os.listdir(patient_dir):
        if filename.endswith('.json'):
            file_path = os.path.join(patient_dir, filename)
            with open(file_path, "r", encoding='utf-8') as f:
                notes.append(json.load(f))
                
    # Ordenar por fecha, más reciente primero
    return sorted(notes, key=lambda x: x.get("date", ""), reverse=True)

def _patient_exists(patient_id):
    """Verifica si un paciente existe"""
    patient_file = os.path.join(PATIENTS_DIR, f"{patient_id}.json")
    return os.path.exists(patient_file)

@router.get("/patients/{patient_id}/clinical-notes", tags=["clinical"])
async def get_patient_clinical_notes(
    patient_id: str = Path(..., title="ID del paciente"),
    type: Optional[str] = None,
    limit: int = Query(50, ge=1, le=100)
):
    """
    Obtiene todas las notas clínicas de un paciente.
    Opcionalmente filtra por tipo de nota.
    """
    if not _patient_exists(patient_id):
        raise HTTPException(status_code=404, detail="Paciente no encontrado")
        
    notes = _load_patient_clinical_notes(patient_id)
    
    if type:
        notes = [note for note in notes if note.get("type") == type]
        
    # Aplicar límite
    notes = notes[:limit]
    
    return {"notes": notes}

@router.get("/patients/{patient_id}/clinical-notes/{note_id}", tags=["clinical"])
async def get_clinical_note(
    patient_id: str = Path(..., title="ID del paciente"),
    note_id: str = Path(..., title="ID de la nota clínica")
):
    """
    Obtiene una nota clínica específica.
    """
    if not _patient_exists(patient_id):
        raise HTTPException(status_code=404, detail="Paciente no encontrado")
        
    note = _load_clinical_note(patient_id, note_id)
    if not note:
        raise HTTPException(status_code=404, detail="Nota clínica no encontrada")
        
    return note

@router.post("/patients/{patient_id}/clinical-notes", tags=["clinical"])
async def create_clinical_note(
    patient_id: str = Path(..., title="ID del paciente"),
    note_data: Dict[str, Any] = None
):
    """
    Crea una nueva nota clínica para un paciente.
    """
    if not note_data:
        raise HTTPException(status_code=400, detail="No se proporcionaron datos para la nota")
        
    if not _patient_exists(patient_id):
        raise HTTPException(status_code=404, detail="Paciente no encontrado")
        
    # Validaciones básicas
    if "type" not in note_data:
        raise HTTPException(status_code=400, detail="El tipo de nota es obligatorio")
        
    if "notes" not in note_data:
        raise HTTPException(status_code=400, detail="El contenido de la nota es obligatorio")
    
    # Guardar nota
    saved_note = _save_clinical_note(patient_id, note_data)
    
    # Actualizar la fecha de última consulta del paciente
    try:
        patient_file = os.path.join(PATIENTS_DIR, f"{patient_id}.json")
        with open(patient_file, "r", encoding='utf-8') as f:
            patient_data = json.load(f)
            patient_data["last_visit"] = datetime.now().isoformat()
        
        with open(patient_file, "w", encoding='utf-8') as f:
            json.dump(patient_data, f, default=str, indent=2, ensure_ascii=False)
    except:
        # Si falla la actualización del paciente, no interrumpir el flujo
        pass
    
    return {"message": "Nota clínica creada correctamente", "note": saved_note}

@router.put("/patients/{patient_id}/clinical-notes/{note_id}", tags=["clinical"])
async def update_clinical_note(
    patient_id: str = Path(..., title="ID del paciente"),
    note_id: str = Path(..., title="ID de la nota clínica"),
    note_data: Dict[str, Any] = None
):
    """
    Actualiza una nota clínica existente.
    """
    if not note_data:
        raise HTTPException(status_code=400, detail="No se proporcionaron datos para actualizar")
        
    if not _patient_exists(patient_id):
        raise HTTPException(status_code=404, detail="Paciente no encontrado")
        
    existing_note = _load_clinical_note(patient_id, note_id)
    if not existing_note:
        raise HTTPException(status_code=404, detail="Nota clínica no encontrada")
    
    # Preservar datos originales que no deberían cambiar
    if "id" in existing_note:
        note_data["id"] = note_id
        
    if "created_at" in existing_note:
        note_data["created_at"] = existing_note["created_at"]
        
    if "patient_id" in existing_note:
        note_data["patient_id"] = patient_id
    
    # Guardar nota actualizada
    updated_note = _save_clinical_note(patient_id, note_data)
    
    return {"message": "Nota clínica actualizada correctamente", "note": updated_note}

@router.delete("/patients/{patient_id}/clinical-notes/{note_id}", tags=["clinical"])
async def delete_clinical_note(
    patient_id: str = Path(..., title="ID del paciente"),
    note_id: str = Path(..., title="ID de la nota clínica")
):
    """
    Elimina una nota clínica existente.
    """
    if not _patient_exists(patient_id):
        raise HTTPException(status_code=404, detail="Paciente no encontrado")
    
    patient_dir = _get_patient_directory(patient_id)
    file_path = os.path.join(patient_dir, f"{note_id}.json")
    
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Nota clínica no encontrada")
        
    # Eliminar archivo
    os.remove(file_path)
    
    return {"message": "Nota clínica eliminada correctamente"}

@router.get("/clinical-note-types", tags=["clinical"])
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