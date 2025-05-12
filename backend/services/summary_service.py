import os
from datetime import datetime

# Importar el servicio de Gemini que ya existe
from services.gemini_service import call_gemini_api

def generate_summary_prompt(transcripcion: str) -> str:
    """
    Genera un prompt estructurado para que Gemini cree un resumen clínico de una transcripción.
    """
    return f"""
Eres un asistente especializado en psicología clínica y terapia familiar. A continuación se te presenta la transcripción de una sesión entre un profesional de la salud y un paciente.

Tu tarea es crear un resumen estructurado que destaque los siguientes aspectos:

1. Motivo principal de consulta o preocupación actual
2. Temas importantes discutidos (máximo 5)
3. Estado emocional del paciente durante la sesión
4. Información relevante sobre relaciones familiares o interpersonales 
5. Eventos significativos mencionados (fechas, acontecimientos traumáticos, cambios)
6. Preocupaciones expresadas por el paciente

Formato del resumen:
- El resumen debe tener entre 300-500 palabras
- Usa lenguaje profesional pero accesible
- Organiza la información en secciones con títulos en negrita
- Destaca frases textuales importantes del paciente entre comillas
- Concluye con 2-3 puntos clave para considerar en siguientes sesiones

Obligatorio:
El resumen debe comenzar directamente con el siguiente título (respetando este formato):
**Motivo Principal de Consulta o Preocupación Actual**

Transcripción:
{transcripcion}

Proporciona únicamente el resumen estructurado, sin introducción ni conclusión adicional.
"""

def generate_session_summary(transcripcion: str) -> dict:
    """
    Genera un resumen estructurado de la transcripción de una sesión utilizando Gemini.
    """
    prompt = generate_summary_prompt(transcripcion)
    
    try:
        # Llamar a la API de Gemini usando la función existente
        respuesta = call_gemini_api(prompt)
        
        # Crear timestamp único para el archivo
        timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S")
        
        return {
            "timestamp": timestamp,
            "summary_text": respuesta,
            "status": "success",
            "model_used": "gemini-2.5-pro-exp-03-25"  # Usar el mismo modelo que en gemini_service.py
        }
    except Exception as e:
        return {
            "timestamp": datetime.utcnow().strftime("%Y%m%d%H%M%S"),
            "summary_text": "",
            "status": "error",
            "error_message": str(e)
        }

def save_session_summary(summary_text: str, patient_dir: str, timestamp: str = None) -> str:
    """
    Guarda el resumen de la sesión en un archivo dentro del directorio del paciente.
    Retorna la ruta del archivo guardado.
    """
    if timestamp is None:
        timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S")
    
    # Asegurarse de que el directorio del paciente exista
    os.makedirs(patient_dir, exist_ok=True)
    
    # Crear nombre de archivo con timestamp
    summary_filename = f"resumen_{timestamp}.txt"
    summary_path = os.path.join(patient_dir, summary_filename)
    
    # Guardar el resumen en un archivo de texto
    with open(summary_path, 'w', encoding='utf-8') as f:
        f.write(summary_text)
    
    return summary_path