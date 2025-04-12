# backend/routes/transcription.py

from fastapi import APIRouter, UploadFile, File, HTTPException
from services.transcription_service import process_audio, parsear_transcripcion_lista
from services.ollama_service import guardar_conversacion_y_paciente
import os
import tempfile

router = APIRouter()

@router.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    if not file.content_type.startswith("audio/"):
        raise HTTPException(status_code=400, detail="El archivo debe ser de audio.")

    try:
        suffix = os.path.splitext(file.filename)[-1]
        with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as temp:
            temp.write(await file.read())
            temp_path = temp.name
    except Exception:
        raise HTTPException(status_code=500, detail="Error al guardar el archivo.")

    try:
        transcripcion_raw = process_audio(temp_path)
        transcripcion = parsear_transcripcion_lista(transcripcion_raw)
        os.remove(temp_path)

        speaker, texto_paciente = guardar_conversacion_y_paciente(
            transcripcion,
            ruta_json="conversacion.json",
            ruta_txt="paciente.txt"
        )

        return {
            "mensaje": "Transcripción completada",
            "paciente": speaker,
            "solo_paciente": texto_paciente,
            "transcripcion_completa": transcripcion
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en el procesamiento: {str(e)}")
