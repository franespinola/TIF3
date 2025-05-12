from app.core.tokenConfigs import HUGGINGFACE_TOKEN
from services.whisperx_service import transcribir_con_whisperx
from services.gemini_service import extract_genogram_with_reflection
from services.summary_service import generate_session_summary, save_session_summary
import os, json
import threading
from datetime import datetime

def generate_summary_async(texto: str, patient_dir: str, ts: str):
    """
    Función asíncrona para generar y guardar el resumen de una sesión.
    """
    try:
        print(f"Iniciando generación asíncrona de resumen...")
        summary_result = generate_session_summary(texto)
        
        if summary_result["status"] == "success":
            summary_text = summary_result.get("summary_text", "")
            summary_path = save_session_summary(summary_text, patient_dir, ts)
            print(f"✅ Resumen generado y guardado en: {summary_path}")
            
            # Aquí podrías actualizar un estado en la base de datos
            # o enviar una notificación cuando el resumen esté listo
        else:
            print(f"❌ Error generando resumen: {summary_result.get('error_message', 'Error desconocido')}")
    except Exception as e:
        print(f"❌ Error en el proceso asíncrono de resumen: {str(e)}")

def process_audio(content: bytes, filename: str, patient: str) -> dict:
    """
    Orquesta y guarda todo en carpeta Pacientes/{patient}:
    - audio
    - transcripción .txt
    - genograma .json
    - resumen .txt (generado asíncronamente)
    """
    # 1. Preparar carpeta del paciente
    base_dir = os.path.dirname(__file__)
    pacientes_dir = os.path.abspath(os.path.join(base_dir, '../Pacientes'))
    patient_dir = os.path.join(pacientes_dir, patient)
    os.makedirs(patient_dir, exist_ok=True)
    # Timestamp para nombres únicos
    ts = datetime.utcnow().strftime("%Y%m%d%H%M%S")

    # 2. Guardar audio
    safe_filename = f"{ts}_{filename}"
    audio_path = os.path.join(patient_dir, safe_filename)
    with open(audio_path, 'wb') as f:
        f.write(content)

    # 3. Transcribir con WhisperX
    segmentos = transcribir_con_whisperx(audio_path, hf_token=HUGGINGFACE_TOKEN)
    texto = "\n".join(
        f"{seg.get('speaker', 'SPEAKER_??')}: {seg.get('text', '').strip()}"
        for seg in segmentos
    )
    # Guardar transcripción completa
    txt_name = f"transcripcion_{ts}.txt"
    transcription_path = os.path.join(patient_dir, txt_name)
    with open(transcription_path, 'w', encoding='utf-8') as f:
        f.write(texto)

    # 4. Iniciar proceso asíncrono para generar resumen ANTES del genograma
    thread = threading.Thread(
        target=generate_summary_async,
        args=(texto, patient_dir, ts)
    )
    thread.daemon = True
    thread.start()

    # 5. Intentar generar genograma
    genogram_result = None
    genogram_path = None
    try:
        genogram_result = extract_genogram_with_reflection(texto)
        data = genogram_result.get('genogram_data', {})
        json_name = f"genograma_{ts}.json"
        genogram_path = os.path.join(patient_dir, json_name)
        with open(genogram_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
    except Exception as e:
        print(f"❌ Error generando genograma: {str(e)}")
        # No lanzamos la excepción, continuamos con la respuesta

    return {
        'patient_dir': patient_dir,
        'recording_path': audio_path,
        'transcription_path': transcription_path,
        'genogram_path': genogram_path,
        'transcription': texto,
        'genogram': genogram_result,
        'summary_pending': True  # Indicar que el resumen está en proceso
    }