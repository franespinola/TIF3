from fastapi import APIRouter, UploadFile, File, HTTPException
from services.recording_service import save_recording

router = APIRouter()

@router.post("/record")
async def record_audio(file: UploadFile = File(...)):
    if not file.content_type.startswith("audio/"):
        raise HTTPException(status_code=400, detail="El archivo debe ser de audio.")
    content = await file.read()
    filepath = save_recording(content, file.filename)
    return {"message": "Grabación recibida", "file_path": filepath}