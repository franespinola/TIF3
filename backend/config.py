# backend/config.py

import os

HUGGINGFACE_TOKEN = os.getenv("HUGGINGFACE_TOKEN", "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")
# Configuración del modelo Whisper.
WHISPER_MODEL_NAME = os.getenv("WHISPER_MODEL_NAME", "large")
DEVICE = os.getenv("DEVICE", "cpu")  # o "cpu" si no tienes GPU (cuda si uso gpu)
COMPUTE_TYPE = os.getenv("COMPUTE_TYPE", "int8")

# Duración de cada bloque de audio en milisegundos (5 minutos)
BLOCK_DURATION_MS = 5 * 60 * 1000

# Tasa de muestreo
SAMPLE_RATE = 16000
