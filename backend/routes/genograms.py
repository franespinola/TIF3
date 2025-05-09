# backend/routes/genograms.py

from fastapi import APIRouter, HTTPException, Path, Query
from typing import List, Optional, Dict, Any
from datetime import datetime
import os
import json
import shutil

router = APIRouter()

# Directorios para almacenar los genogramas
DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")
GENOGRAMS_DIR = os.path.join(DATA_DIR, "genograms")
PATIENTS_DIR = os.path.join(DATA_DIR, "patients")

# Asegurar que los directorios existan
os.makedirs(GENOGRAMS_DIR, exist_ok=True)
os.makedirs(PATIENTS_DIR, exist_ok=True)

def _generate_id():
    """Genera un ID único basado en UUID"""
    from uuid import uuid4
    return str(uuid4())

def _save_genogram(genogram_data):
    """Guarda los datos del genograma en un archivo JSON"""
    genogram_id = genogram_data.get("id")
    if not genogram_id:
        genogram_id = _generate_id()
        genogram_data["id"] = genogram_id
    
    # Asegurar campos de tiempo
    if "created_at" not in genogram_data:
        genogram_data["created_at"] = datetime.now().isoformat()
    
    genogram_data["last_modified"] = datetime.now().isoformat()
    
    # Guardar en directorio general de genogramas
    file_path = os.path.join(GENOGRAMS_DIR, f"{genogram_id}.json")
    with open(file_path, "w", encoding='utf-8') as f:
        json.dump(genogram_data, f, default=str, indent=2, ensure_ascii=False)
    
    # También guardar una copia en el directorio del paciente si tenemos su nombre
    patient_id = genogram_data.get("patient_id")
    if patient_id:
        # Intentar obtener el nombre del paciente
        patient_name = _get_patient_name_by_id(patient_id)
        if patient_name:
            patient_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 
                                      f"Pacientes/{patient_name}")
            os.makedirs(patient_dir, exist_ok=True)
            
            # Usar un nombre de archivo que incluya timestamp para el genograma específico
            timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
            patient_genogram_path = os.path.join(patient_dir, f"genograma_{timestamp}.json")
            with open(patient_genogram_path, "w", encoding='utf-8') as f:
                json.dump(genogram_data, f, default=str, indent=2, ensure_ascii=False)
            
            # Guardar referencia al archivo en el directorio del paciente
            genogram_data["patient_file_path"] = patient_genogram_path
    
    return genogram_data

def _load_genogram(genogram_id):
    """Carga los datos de un genograma desde su archivo JSON"""
    file_path = os.path.join(GENOGRAMS_DIR, f"{genogram_id}.json")
    if not os.path.exists(file_path):
        return None
        
    with open(file_path, "r", encoding='utf-8') as f:
        return json.load(f)

def _load_all_genograms(patient_id=None):
    """Carga todos los genogramas, opcionalmente filtrados por paciente"""
    genograms = []
    
    if not os.path.exists(GENOGRAMS_DIR):
        return []
        
    for filename in os.listdir(GENOGRAMS_DIR):
        if filename.endswith('.json'):
            file_path = os.path.join(GENOGRAMS_DIR, filename)
            with open(file_path, "r", encoding='utf-8') as f:
                genogram = json.load(f)
                if patient_id is None or genogram.get("patient_id") == patient_id:
                    genograms.append(genogram)
                
    return genograms

def _get_patient_name_by_id(patient_id):
    """Obtiene el nombre de un paciente a partir de su ID"""
    patient_file = os.path.join(PATIENTS_DIR, f"{patient_id}.json")
    if not os.path.exists(patient_file):
        return None
        
    try:
        with open(patient_file, "r", encoding='utf-8') as f:
            patient = json.load(f)
            return patient.get("name")
    except:
        return None

@router.get("/genograms", tags=["genograms"])
async def get_genograms(patient_id: Optional[str] = None):
    """
    Obtiene la lista de todos los genogramas.
    Opcionalmente filtra por paciente.
    """
    genograms = _load_all_genograms(patient_id)
    return {"genograms": genograms}

@router.get("/genograms/{genogram_id}", tags=["genograms"])
async def get_genogram(genogram_id: str = Path(..., title="ID del genograma")):
    """
    Obtiene los datos de un genograma específico por su ID.
    """
    genogram = _load_genogram(genogram_id)
    if not genogram:
        raise HTTPException(status_code=404, detail="Genograma no encontrado")
    
    return genogram

@router.post("/genograms", tags=["genograms"])
async def create_genogram(genogram_data: Dict[str, Any]):
    """
    Crea un nuevo genograma.
    """
    # Validaciones básicas
    if "patient_id" not in genogram_data:
        raise HTTPException(status_code=400, detail="ID del paciente es obligatorio")
    
    if "name" not in genogram_data:
        raise HTTPException(status_code=400, detail="El nombre del genograma es obligatorio")
    
    if "data" not in genogram_data:
        raise HTTPException(status_code=400, detail="Los datos del genograma son obligatorios")
    
    # Verificar que el paciente existe
    patient_name = _get_patient_name_by_id(genogram_data["patient_id"])
    if not patient_name:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")
    
    # Guardar genograma
    saved_genogram = _save_genogram(genogram_data)
    
    return {"message": "Genograma creado correctamente", "genogram": saved_genogram}

@router.put("/genograms/{genogram_id}", tags=["genograms"])
async def update_genogram(genogram_id: str, genogram_data: Dict[str, Any]):
    """
    Actualiza los datos de un genograma existente.
    """
    existing_genogram = _load_genogram(genogram_id)
    if not existing_genogram:
        raise HTTPException(status_code=404, detail="Genograma no encontrado")
    
    # Preservar algunos datos originales
    if "created_at" in existing_genogram:
        genogram_data["created_at"] = existing_genogram["created_at"]
    
    if "patient_id" in existing_genogram:
        genogram_data["patient_id"] = existing_genogram["patient_id"]
    
    # Actualizar el ID para asegurar que estamos guardando el correcto
    genogram_data["id"] = genogram_id
    
    # Guardar genograma actualizado
    saved_genogram = _save_genogram(genogram_data)
    
    return {"message": "Genograma actualizado correctamente", "genogram": saved_genogram}

@router.delete("/genograms/{genogram_id}", tags=["genograms"])
async def delete_genogram(genogram_id: str):
    """
    Elimina un genograma existente.
    """
    file_path = os.path.join(GENOGRAMS_DIR, f"{genogram_id}.json")
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Genograma no encontrado")
    
    # Obtener detalles del genograma antes de eliminarlo
    genogram = _load_genogram(genogram_id)
    
    # Eliminar archivo principal
    os.remove(file_path)
    
    # Si hay una copia en el directorio del paciente, eliminarla también
    if genogram and "patient_file_path" in genogram and os.path.exists(genogram["patient_file_path"]):
        os.remove(genogram["patient_file_path"])
    
    return {"message": "Genograma eliminado correctamente"}

@router.get("/patients/{patient_id}/genograms", tags=["genograms"])
async def get_patient_genograms(patient_id: str):
    """
    Obtiene los genogramas de un paciente específico.
    """
    genograms = _load_all_genograms(patient_id)
    return {"genograms": genograms}

@router.post("/genograms/{genogram_id}/export", tags=["genograms"])
async def export_genogram(genogram_id: str, format: str = "json"):
    """
    Exporta un genograma en diferentes formatos.
    Por ahora solo soporta JSON, pero se podría implementar PNG, PDF, etc.
    """
    genogram = _load_genogram(genogram_id)
    if not genogram:
        raise HTTPException(status_code=404, detail="Genograma no encontrado")
    
    if format.lower() != "json":
        raise HTTPException(status_code=400, detail=f"Formato {format} no soportado actualmente")
    
    # Para el caso de JSON, simplemente retornamos los datos
    return genogram