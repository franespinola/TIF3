# backend/services/extraction_service.py

import json

def extract_family_structure(transcription_text: str) -> dict:
    """
    Simula la extracción de la estructura familiar a partir de la transcripción.
    En tu implementación real, aquí harías la integración con Ollama.
    """
    # Ejemplo simulado (en un escenario real, enviarías `transcription_text` a tu LLM)
    estructura_familiar = {
        "paciente": {
            "nombre": "Juan",
            "genero": "masculino",
            "estado": "vivo"
        },
        "familiares": [
            {"nombre": "María", "relacion": "madre", "genero": "femenino", "estado": "fallecida"},
            {"nombre": "Carlos", "relacion": "padre", "genero": "masculino", "estado": "vivo", "relacion_con_paciente": "distante"},
            {"nombre": "Ana", "relacion": "hermana", "genero": "femenino", "estado": "vivo"},
            {"nombre": "Lucas", "relacion": "hijo", "genero": "masculino", "estado": "vivo"}
        ]
    }
    return estructura_familiar
