# backend/routes/extraction.py

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.ollama_service import extract_family_structure

router = APIRouter()

class ExtractionRequest(BaseModel):
    transcription_text: str

@router.post("/extract")
async def extract_structure(request: ExtractionRequest):
    if not request.transcription_text:
        raise HTTPException(status_code=400, detail="Se requiere la transcripción.")
    
    result = extract_family_structure(request.transcription_text)
    return result
