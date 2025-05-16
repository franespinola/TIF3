from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from services.processing_service import process_audio
from app.core.database import get_db
from sqlalchemy.orm import Session as DbSession
from app.models import Patient, Genogram, Session
import uuid
from datetime import datetime
import threading

router = APIRouter()

@router.post("/process_audio")
async def process_audio_endpoint(
    file: UploadFile = File(...),
    patient: str = Form(...),
    created_by: str = Form(None),
    db: DbSession = Depends(get_db)
):
    if not file.content_type.startswith("audio/"):
        raise HTTPException(status_code=400, detail="El archivo debe ser de audio.")
    
    # Verificar que el paciente exista en la base de datos
    patient_record = db.query(Patient).filter(Patient.name == patient).first()
    if not patient_record:
        raise HTTPException(status_code=404, detail=f"No se encontró al paciente: {patient}")
    
    content = await file.read()
    try:
        # Procesar el audio y obtener resultados
        result = process_audio(content, file.filename, patient)

        # Generar timestamp único para la sesión y el resumen
        summary_timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        
        # Generar ID del genograma si se creó uno
        genogram_id = None
        if result.get('genogram') and result.get('genogram_path'):
            genogram_data = result.get('genogram', {}).get('genogram_data', {})
            genogram_id = str(uuid.uuid4())
            
            new_genogram = Genogram(
                id=genogram_id,
                patient_id=patient_record.id,
                name=f"Genograma de {patient} - {datetime.now().strftime('%Y-%m-%d')}",
                data=genogram_data,
                description="Generado automáticamente desde audio"
            )
            db.add(new_genogram)
            db.commit()

        # Crear registro de la sesión
        new_session = Session(
            patient_id=patient_record.id,
            audio_url=result.get('recording_path'),
            transcript=result.get('transcription'),
            summary=None,
            genogram_id=genogram_id,
            created_by=created_by or "sistema",
            summary_timestamp=summary_timestamp
        )
        db.add(new_session)
        db.commit()
        db.refresh(new_session)

        # Agregar datos al resultado para el frontend
        result['session_id'] = new_session.id
        result['timestamp'] = summary_timestamp

        # Iniciar resumen asincrónico
        from services.processing_service import generate_summary_async
        thread = threading.Thread(
            target=generate_summary_async,
            args=(result.get('transcription'), result.get('patient_dir'), summary_timestamp, new_session.id)
        )
        thread.daemon = True
        thread.start()
        
        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al procesar el audio: {str(e)}")
