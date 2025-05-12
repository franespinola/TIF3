# backend/routes/transcription.py

from fastapi import APIRouter, UploadFile, File, HTTPException
from services.whisperx_service import transcribir_con_whisperx, exportar_transcripcion_txt
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
        from app.core.tokenConfigs import HUGGINGFACE_TOKEN
        segmentos = transcribir_con_whisperx(temp_path, hf_token=HUGGINGFACE_TOKEN)
        os.remove(temp_path)

        # Exportar charla completa a .txt para registro o LLM
        exportar_transcripcion_txt(segmentos, ruta_txt="conversacion.txt")

        # Convertir a formato SPEAKER: texto
        texto_conversacion = "\n".join(
            f"{seg.get('speaker', 'SPEAKER_??')}: {seg.get('text', '').strip()}"
            for seg in segmentos
        )

        return {
            "mensaje": "Transcripción completada",
            "transcripcion": texto_conversacion
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en el procesamiento: {str(e)}")
