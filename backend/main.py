# backend/main.py

from fastapi import FastAPI
from routes import transcription, extraction

app = FastAPI(title="Backend para Genograma con Diarización y Whisper+Ollama")

# Incluir endpoints
app.include_router(transcription.router, prefix="/api")
app.include_router(extraction.router, prefix="/api")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
