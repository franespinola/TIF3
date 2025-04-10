import os
import tempfile
import datetime
from pydub import AudioSegment
from faster_whisper import WhisperModel
from pyannote.audio import Pipeline
import ffmpeg

HUGGINGFACE_TOKEN = os.getenv("HUGGINGFACE_TOKEN")
SAMPLE_RATE = 16000
BLOCK_DURATION_MS = 5 * 60 * 1000  # 5 minutos

pipeline = Pipeline.from_pretrained("pyannote/speaker-diarization@2.1", use_auth_token=HUGGINGFACE_TOKEN)
whisper_model = WhisperModel("large-v3", device="cuda", compute_type="float16")

def extract_segment(input_file, start_time, end_time):
    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as temp_audio:
        temp_filename = temp_audio.name
    (
        ffmpeg
        .input(input_file, ss=start_time, to=end_time)
        .output(temp_filename, ac=1, ar=SAMPLE_RATE)
        .overwrite_output()
        .run(quiet=True)
    )
    return temp_filename

def transcribe_and_diarize(audio_path):
    full_audio = AudioSegment.from_file(audio_path).set_channels(1).set_frame_rate(SAMPLE_RATE)
    temp_dir = tempfile.mkdtemp()
    chunks = []

    for i in range(0, len(full_audio), BLOCK_DURATION_MS):
        chunk = full_audio[i:i + BLOCK_DURATION_MS]
        chunk_path = os.path.join(temp_dir, f"chunk_{i//BLOCK_DURATION_MS}.wav")
        chunk.export(chunk_path, format="wav")
        chunks.append((chunk_path, i // 1000))  # offset en segundos

    final_transcription = []

    for chunk_path, offset_sec in chunks:
        diarization = pipeline(chunk_path)

        for segment in diarization.itertracks(yield_label=True):
            start = segment[0].start
            end = segment[0].end
            speaker = segment[2]

            segment_file = extract_segment(chunk_path, start, end)
            segments, _ = whisper_model.transcribe(segment_file, language="es")

            for seg in segments:
                full_start = int(offset_sec + start + seg.start)
                timestamp = str(datetime.timedelta(seconds=full_start))
                text = seg.text.strip()
                final_transcription.append(f"[{timestamp}] {speaker}: {text}")

    return "\n".join(final_transcription)
