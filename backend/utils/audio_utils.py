# backend/utils/audio_utils.py

import os
import tempfile
import ffmpeg
from pydub import AudioSegment

def split_audio(audio_path: str, block_duration_ms: int) -> list:
    """
    Divide el audio en bloques de duración block_duration_ms.
    Devuelve una lista de tuples: (ruta_del_chunk, offset_en_segundos)
    """
    full_audio = AudioSegment.from_file(audio_path).set_channels(1).set_frame_rate(16000)
    temp_dir = tempfile.mkdtemp()
    chunks = []
    for i in range(0, len(full_audio), block_duration_ms):
        chunk = full_audio[i:i + block_duration_ms]
        chunk_path = os.path.join(temp_dir, f"chunk_{i//block_duration_ms}.wav")
        chunk.export(chunk_path, format="wav")
        chunks.append((chunk_path, i // 1000))  # offset en segundos
    return chunks

def extract_segment(input_file: str, start_time: float, end_time: float, sample_rate: int) -> str:
    """
    Extrae un segmento del audio usando ffmpeg.
    Devuelve la ruta de un archivo temporal con el segmento.
    """
    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as temp_audio:
        temp_filename = temp_audio.name
    (
        ffmpeg
        .input(input_file, ss=start_time, to=end_time)
        .output(temp_filename, ac=1, ar=sample_rate)
        .overwrite_output()
        .run(quiet=True)
    )
    return temp_filename
