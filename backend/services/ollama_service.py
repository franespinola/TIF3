import json
import requests
from typing import List

# Consulta al modelo LLM en Ollama
def consultar_ollama(prompt: str, modelo: str = "deepseek-r1:14b") -> str:
    url = "http://localhost:11434/api/generate"
    response = requests.post(url, json={
        "model": modelo,
        "prompt": prompt,
        "stream": False
    })
    if response.status_code == 200:
        return response.json()['response'].strip()
    else:
        raise Exception(f"Error al consultar Ollama: {response.text}")

# Genera el prompt para que el LLM detecte al paciente
def generar_prompt_identificacion(transcripcion: List[dict]) -> str:
    prompt = (
        "A continuación, se presenta una transcripción de una entrevista entre un profesional de la salud y un paciente. "
        "Cada línea está precedida por un identificador del hablante (SPEAKER_00, SPEAKER_01, etc.). "
        "Tu tarea es identificar cuál de los hablantes está contando su historia personal y familiar, es decir, el paciente.\n\n"
        "Transcripción:\n"
    )
    for segmento in transcripcion[:30]:  # usar las primeras 30 líneas
        prompt += f"{segmento['speaker']}: {segmento['text']}\n"
    prompt += "\n¿Quién es el paciente? Responde solo con el identificador, como: SPEAKER_00"
    return prompt

# Función principal: guarda JSON + extrae texto del paciente
def guardar_conversacion_y_paciente(transcripcion: List[dict], ruta_json="conversacion.json", ruta_txt="paciente.txt", modelo="deepseek-r1:14b"):
    # Guardar toda la conversación como JSON
    with open(ruta_json, "w", encoding="utf-8") as f:
        json.dump(transcripcion, f, indent=2, ensure_ascii=False)

    # Detectar quién es el paciente
    prompt = generar_prompt_identificacion(transcripcion)
    speaker_paciente = consultar_ollama(prompt, modelo=modelo)

    # Filtrar lo que dijo el paciente
    texto_paciente = "\n".join(
        segmento["text"]
        for segmento in transcripcion
        if segmento["speaker"] == speaker_paciente
    )

    # Guardar solo lo que dijo el paciente como .txt
    with open(ruta_txt, "w", encoding="utf-8") as f:
        f.write(texto_paciente)

    return speaker_paciente, texto_paciente
