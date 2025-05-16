from fastapi import APIRouter, HTTPException, Body, Query, Depends
import os
from services.summary_service import generate_session_summary, save_session_summary
from datetime import datetime
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models import Session as SessionModel

router = APIRouter(
    prefix="/summaries",
    tags=["summaries"],
    responses={404: {"description": "No encontrado"}},
)

@router.post("/generate")
async def generate_summary(data: dict = Body(...)):
    transcripcion = data.get("transcripcion")
    patient = data.get("patient")
    
    if not transcripcion:
        raise HTTPException(status_code=400, detail="La transcripción es obligatoria")
    if not patient:
        raise HTTPException(status_code=400, detail="El nombre del paciente es obligatorio")
    
    try:
        base_dir = os.path.dirname(os.path.dirname(__file__))
        pacientes_dir = os.path.join(base_dir, "Pacientes")
        patient_dir = os.path.join(pacientes_dir, patient)
        os.makedirs(patient_dir, exist_ok=True)
        
        result = generate_session_summary(transcripcion)
        
        if result["status"] != "success":
            raise HTTPException(
                status_code=500, 
                detail=f"Error generando el resumen: {result.get('error_message', 'Error desconocido')}"
            )
        
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
    try:
        base_dir = os.path.dirname(os.path.dirname(__file__))
        patient_dir = os.path.join(base_dir, "Pacientes", patient_name)
        
        if not os.path.exists(patient_dir):
            raise HTTPException(status_code=404, detail=f"No se encontró el paciente: {patient_name}")
        
        summaries = []
        for file in os.listdir(patient_dir):
            if file.startswith("resumen_") and file.endswith(".txt"):
                filepath = os.path.join(patient_dir, file)
                timestamp = file.replace("resumen_", "").replace(".txt", "")
                
                try:
                    with open(filepath, "r", encoding="utf-8") as f:
                        content = f.read()
                    
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
    try:
        base_dir = os.path.dirname(os.path.dirname(__file__))
        summary_path = os.path.join(base_dir, "Pacientes", patient, f"resumen_{timestamp}.txt")
        
        if not os.path.exists(summary_path):
            raise HTTPException(status_code=404, detail="Resumen no encontrado")
        
        with open(summary_path, "r", encoding="utf-8") as f:
            content = f.read()
        
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

@router.put("/{timestamp}")
async def update_summary(
    timestamp: str,
    data: dict = Body(...),
    db: Session = Depends(get_db)
):
    """
    Actualiza un resumen existente (archivo + campo summary en BD).
    Requiere: {"summary": "nuevo contenido", "patient": "nombre_paciente"}
    """
    summary_text = data.get("summary")
    patient = data.get("patient")

    if not summary_text or not patient:
        raise HTTPException(status_code=400, detail="Faltan datos obligatorios")

    try:
        base_dir = os.path.dirname(os.path.dirname(__file__))
        summary_path = os.path.join(base_dir, "Pacientes", patient, f"resumen_{timestamp}.txt")

        if not os.path.exists(summary_path):
            raise HTTPException(status_code=404, detail="Resumen no encontrado")

        with open(summary_path, "w", encoding="utf-8") as f:
            f.write(summary_text)

        # Actualizar también en base de datos
        session = db.query(SessionModel).filter(SessionModel.summary_timestamp == timestamp).first()
        if session:
            session.summary = summary_text
            db.commit()

        return {
            "status": "success",
            "message": f"Resumen actualizado correctamente ({timestamp})"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al actualizar el resumen: {str(e)}")
