# backend/routes/transcription.py

from fastapi import APIRouter, UploadFile, File, HTTPException
from services.transcription_service import process_audio
import os
import tempfile

router = APIRouter()

@router.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    if not file.content_type.startswith("audio/"):
        raise HTTPException(status_code=400, detail="El archivo debe ser de audio.")
    
    # Guarda el archivo temporalmente
    try:
        suffix = os.path.splitext(file.filename)[-1]
        with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as temp:
            temp.write(await file.read())
            temp_path = temp.name
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error al guardar el archivo.")

    # Llama a la función de procesamiento
    transcription_lines = process_audio(temp_path)
    # Elimina el archivo temporal
    os.remove(temp_path)
    
    return {"transcription": transcription_lines}
