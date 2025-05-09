# backend/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import transcription, audio_recording, process_audio, patients, genograms, clinical_notes

app = FastAPI(title="Sistema de Genogramas y Gestión Clínica")

# Configurar CORS para permitir peticiones desde el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend React
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir endpoints existentes para procesamiento de audio
app.include_router(transcription.router, prefix="/api")
app.include_router(audio_recording.router, prefix="/api")
app.include_router(process_audio.router, prefix="/api")

# Nuevos endpoints para gestión clínica
app.include_router(patients.router, prefix="/api")
app.include_router(genograms.router, prefix="/api")
app.include_router(clinical_notes.router, prefix="/api")

# Crear los directorios de datos si no existen
import os
data_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data")
os.makedirs(os.path.join(data_dir, "patients"), exist_ok=True)
os.makedirs(os.path.join(data_dir, "genograms"), exist_ok=True)
os.makedirs(os.path.join(data_dir, "clinical"), exist_ok=True)

@app.get("/")
async def root():
    return {"message": "API del Sistema de Genogramas y Gestión Clínica"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
