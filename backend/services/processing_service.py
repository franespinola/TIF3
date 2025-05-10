from app.core.tokenConfigs import HUGGINGFACE_TOKEN
from services.whisperx_service import transcribir_con_whisperx
from services.gemini_service import extract_genogram_with_reflection
import os, json
from datetime import datetime

def process_audio(content: bytes, filename: str, patient: str) -> dict:
    """
    Orquesta y guarda todo en carpeta Pacientes/{patient}:
    - audio
    - transcripción .txt
    - genograma .json
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

    # 4. Generar genograma con Gemini
    genogram_result = extract_genogram_with_reflection(texto)
    data = genogram_result.get('genogram_data', {})
    json_name = f"genograma_{ts}.json"
    genogram_path = os.path.join(patient_dir, json_name)
    with open(genogram_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    return {
        'patient_dir': patient_dir,
        'recording_path': audio_path,
        'transcription_path': transcription_path,
        'genogram_path': genogram_path,
        'transcription': texto,
        'genogram': genogram_result
    }