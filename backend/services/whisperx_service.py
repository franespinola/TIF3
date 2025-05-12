# backend/services/whisperx_service.py

import whisperx
import torch
import gc

print(f"🧠 Dispositivo seleccionado: {torch.cuda.get_device_name(0) if torch.cuda.is_available() else 'CPU'}")
print(f"torch.device: {torch.device('cuda' if torch.cuda.is_available() else 'cpu')}")

def transcribir_con_whisperx(audio_path: str, hf_token: str) -> list:
    """
    Transcribe un archivo de audio con WhisperX, alinea las palabras
    y asigna hablantes automáticamente.

    Retorna una lista de segmentos con:
      - start
      - end
      - text
      - speaker
      - words (palabra a palabra con tiempos y hablante)
    """
    device = "cuda" if torch.cuda.is_available() else "cpu"
    compute_type = "float16" if device == "cuda" else "int8"
    batch_size = 16

    # 1. Cargar modelo Whisper
    model = whisperx.load_model("large-v3", device, compute_type=compute_type)
    audio = whisperx.load_audio(audio_path)
    result = model.transcribe(audio, batch_size=batch_size, language="es")

    # 2. Alineación
    model_a, metadata = whisperx.load_align_model(language_code=result["language"], device=device)
    result = whisperx.align(result["segments"], model_a, metadata, audio, device, return_char_alignments=False)

    # Liberar modelos para ahorrar memoria
    gc.collect()
    if device == "cuda":
        torch.cuda.empty_cache()
    del model
    del model_a

    # 3. Diarización
    diarize_model = whisperx.diarize.DiarizationPipeline(use_auth_token=hf_token, device=device)
    diarize_segments = diarize_model(audio)

    # 4. Asignar hablantes a palabras
    result = whisperx.assign_word_speakers(diarize_segments, result)
    return result["segments"]

def exportar_transcripcion_txt(segmentos: list, ruta_txt="conversacion.txt"):
    """
    Exporta la transcripción completa a un archivo .txt con formato:
    SPEAKER_00: Hola, ¿cómo estás?
    SPEAKER_01: Bien, ¿y vos?
    """
    with open(ruta_txt, "w", encoding="utf-8") as f:
        for seg in segmentos:
            speaker = seg.get("speaker", "SPEAKER_??")
            texto = seg.get("text", "").strip()
            f.write(f"{speaker}: {texto}\n")

