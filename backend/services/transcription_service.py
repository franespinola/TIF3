# backend/services/transcription_service.py

import datetime
import re
import os
from pyannote.audio import Pipeline
from faster_whisper import WhisperModel
from config import HUGGINGFACE_TOKEN, WHISPER_MODEL_NAME, DEVICE, COMPUTE_TYPE, BLOCK_DURATION_MS, SAMPLE_RATE
from utils.audio_utils import split_audio, extract_segment

# Inicializamos los modelos (esto se hace una sola vez)
diarization_pipeline = Pipeline.from_pretrained("pyannote/speaker-diarization@2.1", use_auth_token=HUGGINGFACE_TOKEN)
whisper_model = WhisperModel(WHISPER_MODEL_NAME, device=DEVICE, compute_type=COMPUTE_TYPE)

def process_audio(audio_path: str) -> list:
    """
    Procesa el audio completo:
      - Divide en bloques.
      - Para cada bloque, realiza diarización y transcribe.
    Retorna una lista de líneas de transcripción.
    """
    final_transcription = []
    chunks = split_audio(audio_path, BLOCK_DURATION_MS)
    print(f"Dividiendo audio en {len(chunks)} bloques...")
    
    for chunk_path, offset_sec in chunks:
        print(f"Procesando bloque con offset {offset_sec} segundos...")
        diarization = diarization_pipeline(chunk_path, num_speakers=2)
        
        # Itera sobre cada segmento detectado
        for segment, _, speaker in diarization.itertracks(yield_label=True):
            start = segment.start
            end = segment.end
            # Extrae el segmento de audio
            segment_file = extract_segment(chunk_path, start, end, SAMPLE_RATE)
            # Transcribe el segmento (la función transcribe retorna segments y otras info)
            segments, _ = whisper_model.transcribe(segment_file, language="es")
            
            for seg in segments:
                full_start = int(offset_sec + start + seg.start)
                timestamp = str(datetime.timedelta(seconds=full_start))
                text = seg.text.strip()
                final_transcription.append(f"[{timestamp}] {speaker}: {text}")
            # Opcional: elimina el archivo temporal del segmento
            os.remove(segment_file)
        # Opcional: se puede borrar cada chunk después de procesar
        os.remove(chunk_path)
    return final_transcription

def parsear_transcripcion_lista(transcripcion: list[str]) -> list[dict]:
    resultado = []
    for linea in transcripcion:
        match = re.match(r"\[.*?\]\s+(SPEAKER_\d+):\s+(.*)", linea)
        if match:
            speaker, text = match.groups()
            resultado.append({"speaker": speaker, "text": text})
    return resultado