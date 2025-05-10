# backend/app/core/config.py

import os

HUGGINGFACE_TOKEN = os.getenv("HUGGINGFACE_TOKEN", "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")
# Configuración del modelo Whisper.
WHISPER_MODEL_NAME = os.getenv("WHISPER_MODEL_NAME", "large-v3")

# Duración de cada bloque de audio en milisegundos (5 minutos)
BLOCK_DURATION_MS = 5 * 60 * 1000

# Tasa de muestreo
SAMPLE_RATE = 16000

## modelos LLM ##
LLM_MODEL_NAME = os.getenv("LLM_MODEL_NAME", "deepseek-r1-14b-chat") # otro modelo = command-r-plus  deepseek-r1:14b llama3:8b command-r qwq:latest mistral-small3.1:latest 