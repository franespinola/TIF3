from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from services.processing_service import process_audio

router = APIRouter()

@router.post("/process_audio")
async def process_audio_endpoint(
    file: UploadFile = File(...),
    patient: str = Form(...)
):
    if not file.content_type.startswith("audio/"):
        raise HTTPException(status_code=400, detail="El archivo debe ser de audio.")
    content = await file.read()
    try:
        result = process_audio(content, file.filename, patient)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al procesar el audio: {str(e)}")