from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import shutil
import os
import uuid
from dotenv import load_dotenv
from modules.transcriber import transcribe_and_diarize
from modules.llm_processor import extract_genogram_from_text

# Cargar variables de entorno desde .env
load_dotenv()

app = FastAPI()

UPLOAD_DIR = "temp_uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

class TranscriptionRequest(BaseModel):
    text: str

@app.post("/upload-audio")
async def upload_audio(file: UploadFile = File(...)):
    try:
        file_id = str(uuid.uuid4())
        file_path = os.path.join(UPLOAD_DIR, f"{file_id}.wav")
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        return {"file_id": file_id, "path": file_path}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/transcribe")
async def transcribe_audio(file_id: str):
    file_path = os.path.join(UPLOAD_DIR, f"{file_id}.wav")
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Archivo no encontrado")
    try:
        transcription = transcribe_and_diarize(file_path)
        return {"transcription": transcription}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/extract-genogram")
async def extract_genogram(request: TranscriptionRequest):
    try:
        genogram_json = extract_genogram_from_text(request.text)
        return JSONResponse(content=genogram_json)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/full-process")
async def full_process(file: UploadFile = File(...)):
    try:
        file_id = str(uuid.uuid4())
        file_path = os.path.join(UPLOAD_DIR, f"{file_id}.wav")
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        transcription = transcribe_and_diarize(file_path)
        genogram_json = extract_genogram_from_text(transcription)
        return JSONResponse(content=genogram_json)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
