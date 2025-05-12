from fastapi import APIRouter, HTTPException, Body, Query
import os
from services.summary_service import generate_session_summary, save_session_summary
from datetime import datetime

router = APIRouter(
    prefix="/summaries",
    tags=["summaries"],
    responses={404: {"description": "No encontrado"}},
)

@router.post("/generate")
async def generate_summary(data: dict = Body(...)):
    """
    Genera un resumen para una transcripción existente.
    Requiere el cuerpo: {"transcripcion": "texto...", "patient": "nombre_paciente"}
    """
    transcripcion = data.get("transcripcion")
    patient = data.get("patient")
    
    if not transcripcion:
        raise HTTPException(status_code=400, detail="La transcripción es obligatoria")
    if not patient:
        raise HTTPException(status_code=400, detail="El nombre del paciente es obligatorio")
    
    try:
        # Directorio del paciente
        base_dir = os.path.dirname(os.path.dirname(__file__))  # Un nivel arriba de 'routes'
        pacientes_dir = os.path.join(base_dir, "Pacientes")
        patient_dir = os.path.join(pacientes_dir, patient)
        os.makedirs(patient_dir, exist_ok=True)
        
        # Generar resumen
        result = generate_session_summary(transcripcion)
        
        if result["status"] != "success":
            raise HTTPException(
                status_code=500, 
                detail=f"Error generando el resumen: {result.get('error_message', 'Error desconocido')}"
            )
        
        # Guardar resumen
        summary_text = result.get("summary_text", "")
        timestamp = result.get("timestamp")
        summary_path = save_session_summary(summary_text, patient_dir, timestamp)
        
        return {
            "status": "success",
            "summary": summary_text,
            "summary_path": summary_path,
            "timestamp": timestamp
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en el proceso: {str(e)}")

@router.get("/patient/{patient_name}")
async def get_patient_summaries(patient_name: str):
    """
    Obtiene todos los resúmenes disponibles para un paciente.
    """
    try:
        # Directorio del paciente
        base_dir = os.path.dirname(os.path.dirname(__file__))
        patient_dir = os.path.join(base_dir, "Pacientes", patient_name)
        
        if not os.path.exists(patient_dir):
            raise HTTPException(status_code=404, detail=f"No se encontró el paciente: {patient_name}")
        
        # Buscar archivos de resumen
        summaries = []
        for file in os.listdir(patient_dir):
            if file.startswith("resumen_") and file.endswith(".txt"):
                filepath = os.path.join(patient_dir, file)
                timestamp = file.replace("resumen_", "").replace(".txt", "")
                
                try:
                    with open(filepath, "r", encoding="utf-8") as f:
                        content = f.read()
                        
                    # Buscar el archivo de transcripción correspondiente
                    transcription_file = f"transcripcion_{timestamp}.txt"
                    transcription_path = os.path.join(patient_dir, transcription_file)
                    transcription_exists = os.path.exists(transcription_path)
                    
                    summaries.append({
                        "id": timestamp,
                        "timestamp": timestamp,
                        "date": datetime.strptime(timestamp, "%Y%m%d%H%M%S").isoformat(),
                        "patient": patient_name,
                        "summary": content,
                        "filepath": filepath,
                        "has_transcription": transcription_exists
                    })
                except Exception as e:
                    print(f"Error al leer el archivo {filepath}: {str(e)}")
        
        # Ordenar por timestamp (más reciente primero)
        summaries.sort(key=lambda x: x["timestamp"], reverse=True)
        
        return {
            "patient": patient_name,
            "count": len(summaries),
            "summaries": summaries
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error obteniendo resúmenes: {str(e)}")

@router.get("/{timestamp}")
async def get_summary(timestamp: str, patient: str = Query(...)):
    """
    Obtiene un resumen específico por su timestamp y nombre de paciente.
    """
    try:
        # Construir ruta al archivo de resumen
        base_dir = os.path.dirname(os.path.dirname(__file__))
        summary_path = os.path.join(base_dir, "Pacientes", patient, f"resumen_{timestamp}.txt")
        
        if not os.path.exists(summary_path):
            raise HTTPException(status_code=404, detail="Resumen no encontrado")
        
        # Leer contenido del resumen
        with open(summary_path, "r", encoding="utf-8") as f:
            content = f.read()
        
        # Verificar si existe la transcripción
        transcription_path = os.path.join(base_dir, "Pacientes", patient, f"transcripcion_{timestamp}.txt")
        transcription_exists = os.path.exists(transcription_path)
        
        transcription_content = None
        if transcription_exists:
            with open(transcription_path, "r", encoding="utf-8") as f:
                transcription_content = f.read()
        
        return {
            "id": timestamp,
            "timestamp": timestamp,
            "date": datetime.strptime(timestamp, "%Y%m%d%H%M%S").isoformat(),
            "patient": patient,
            "summary": content,
            "has_transcription": transcription_exists,
            "transcription": transcription_content
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error obteniendo el resumen: {str(e)}")