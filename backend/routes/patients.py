# backend/routes/patients.py

from fastapi import APIRouter, HTTPException, Query, Path
from typing import List, Optional
from datetime import datetime
import os
import json

router = APIRouter()

# Directorio para almacenar los datos de pacientes
DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")
PATIENTS_DIR = os.path.join(DATA_DIR, "patients")

# Asegurar que los directorios existan
os.makedirs(PATIENTS_DIR, exist_ok=True)

def _generate_id():
    """Genera un ID único basado en timestamp"""
    from uuid import uuid4
    return str(uuid4())

def _save_patient(patient_data):
    """Guarda los datos del paciente en un archivo JSON"""
    patient_id = patient_data.get("id")
    if not patient_id:
        patient_id = _generate_id()
        patient_data["id"] = patient_id
    
    file_path = os.path.join(PATIENTS_DIR, f"{patient_id}.json")
    with open(file_path, "w", encoding='utf-8') as f:
        json.dump(patient_data, f, default=str, indent=2, ensure_ascii=False)
    
    # Crear directorio para archivos del paciente si no existe
    patient_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 
                              f"Pacientes/{patient_data['name']}")
    os.makedirs(patient_dir, exist_ok=True)
    
    return patient_data

def _load_patient(patient_id):
    """Carga los datos de un paciente desde su archivo JSON"""
    file_path = os.path.join(PATIENTS_DIR, f"{patient_id}.json")
    if not os.path.exists(file_path):
        return None
        
    with open(file_path, "r", encoding='utf-8') as f:
        return json.load(f)

def _load_all_patients():
    """Carga todos los pacientes"""
    patients = []
    
    if not os.path.exists(PATIENTS_DIR):
        return []
        
    for filename in os.listdir(PATIENTS_DIR):
        if filename.endswith('.json'):
            file_path = os.path.join(PATIENTS_DIR, filename)
            with open(file_path, "r", encoding='utf-8') as f:
                patients.append(json.load(f))
                
    return patients

@router.get("/patients", tags=["patients"])
async def get_patients(name: Optional[str] = None):
    """
    Obtiene la lista de todos los pacientes.
    Opcionalmente filtra por nombre.
    """
    patients = _load_all_patients()
    
    if name:
        patients = [p for p in patients if name.lower() in p.get("name", "").lower()]
        
    return {"patients": patients}

@router.get("/patients/{patient_id}", tags=["patients"])
async def get_patient(patient_id: str = Path(..., title="ID del paciente")):
    """
    Obtiene los datos de un paciente específico por su ID.
    """
    patient = _load_patient(patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")
    
    return patient

@router.post("/patients", tags=["patients"])
async def create_patient(patient_data: dict):
    """
    Crea un nuevo paciente.
    """
    # Validaciones básicas
    if not patient_data.get("name"):
        raise HTTPException(status_code=400, detail="El nombre del paciente es obligatorio")
    
    # Añadir campos obligatorios si no existen
    if "first_visit" not in patient_data:
        patient_data["first_visit"] = datetime.now().isoformat()
        
    if "last_visit" not in patient_data:
        patient_data["last_visit"] = datetime.now().isoformat()
    
    # Guardar paciente
    saved_patient = _save_patient(patient_data)
    
    return {"message": "Paciente creado correctamente", "patient": saved_patient}

@router.put("/patients/{patient_id}", tags=["patients"])
async def update_patient(patient_id: str, patient_data: dict):
    """
    Actualiza los datos de un paciente existente.
    """
    existing_patient = _load_patient(patient_id)
    if not existing_patient:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")
    
    # Actualizar campos
    updated_patient = {**existing_patient, **patient_data}
    
    # Si se actualiza el nombre, considerar actualizar el directorio también
    if "name" in patient_data and patient_data["name"] != existing_patient.get("name"):
        # La implementación de la actualización del directorio quedaría para una versión más avanzada
        pass
    
    # Guardar paciente actualizado
    saved_patient = _save_patient(updated_patient)
    
    return {"message": "Paciente actualizado correctamente", "patient": saved_patient}

@router.delete("/patients/{patient_id}", tags=["patients"])
async def delete_patient(patient_id: str):
    """
    Elimina un paciente existente.
    """
    file_path = os.path.join(PATIENTS_DIR, f"{patient_id}.json")
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Paciente no encontrado")
    
    # En una implementación real, consideraríamos:
    # 1. Eliminar o archivar datos relacionados (genogramas, notas)
    # 2. Implementar eliminación lógica vs física
    
    os.remove(file_path)
    
    return {"message": "Paciente eliminado correctamente"}

@router.get("/patients/{patient_id}/appointments", tags=["patients"])
async def get_patient_appointments(patient_id: str):
    """
    Obtiene las citas de un paciente específico.
    """
    patient = _load_patient(patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")
    
    # En una implementación completa, buscaríamos en una colección de citas
    # Por ahora, usamos una versión simplificada
    appointments = patient.get("appointments", [])
    
    return {"appointments": appointments}

@router.post("/patients/{patient_id}/appointments", tags=["patients"])
async def create_patient_appointment(patient_id: str, appointment_data: dict):
    """
    Crea una nueva cita para un paciente.
    """
    patient = _load_patient(patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")
    
    # Validar datos de la cita
    if "date" not in appointment_data:
        raise HTTPException(status_code=400, detail="La fecha de la cita es obligatoria")
    
    # Crear nueva cita
    appointments = patient.get("appointments", [])
    new_appointment = {
        "id": _generate_id(),
        **appointment_data,
        "patient_id": patient_id,
        "created_at": datetime.now().isoformat()
    }
    
    appointments.append(new_appointment)
    patient["appointments"] = appointments
    
    # Guardar datos actualizados
    _save_patient(patient)
    
    return {"message": "Cita creada correctamente", "appointment": new_appointment}