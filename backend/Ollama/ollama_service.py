import requests
import re
import json
from datetime import datetime
from app.core.tokenConfigs import LLM_MODEL_NAME  # Asegurate que esto sea "deepseek-r1-chat"

def consultar_ollama(prompt: str, modelo: str = LLM_MODEL_NAME) -> str:
    """
    Envía un 'prompt' al endpoint de Ollama en /api/chat y devuelve la respuesta
    sin el contenido dentro de <think> ... </think>.
    """
    url = "http://localhost:11434/api/chat"
    payload = {
        "model": modelo,
        "messages": [
            {
                "role": "user",
                "content": prompt
            }
        ],
        "stream": False
    }
    response = requests.post(url, json=payload)
    if response.status_code == 200:
        respuesta_cruda = response.json()['message']['content'].strip()
        # Limpieza: quitar bloques <think> si existen
        sin_think = re.sub(r"<think>.*?</think>", "", respuesta_cruda, flags=re.DOTALL).strip()
        return sin_think
    else:
        raise Exception(f"Error al consultar Ollama: {response.text}")

def generar_prompt_genograma(transcripcion: str) -> str:
    """
    Primer prompt principal para que el modelo genere el JSON del genograma.
    """
    prompt = f"""
Tu tarea es extraer información relevante de una entrevista realizada a un paciente para generar un genograma.

🔹 Identifica personas (paciente, padres, hijos, hermanos, abuelos, tíos, primos) y eventos importantes (abortos, adopciones, fallecimientos).
🔹 Identifica relaciones entre ellos (matrimonio, divorcio, cohabitación, conflictos, cercanía, distancia, violencia, etc.).
🔹 Devuelve un objeto JSON con exactamente dos listas: "nodes" y "edges".

🎯 Reglas obligatorias:
- El nodo del paciente debe tener "type": "paciente"
- Para personas fallecidas, usa "fallecidoM" (hombre) o "fallecidoF" (mujer).
- Para abortos, usa un nodo con type "aborto".
- Cada nodo debe tener un ID único, un "position" aproximado y una "data" con "label" y "generation".
- Cada relación debe tener una edge con "relType" adecuado.
- Usa "parentChild" solo para relaciones ascendentes/descendientes.

📌 Formato esperado:
{{
  "nodes": [
    {{
      "id": "1",
      "type": "paciente" | "masculino" | "femenino" | "fallecidoM" | "fallecidoF" | "embarazo" | "aborto" | "adopcion",
      "position": {{ "x": número, "y": número }},
      "data": {{
        "label": "Nombre o descripción",
        "generation": número
      }}
    }}
  ],
  "edges": [
    {{
      "id": "1-2-cohabitacion",
      "source": "1",
      "target": "2",
      "type": "relationshipEdge",
      "data": {{
        "relType": "cohabitacion" | "matrimonio" | "conflicto" | "cercana" | "distante" | "compromiso" | "violencia" | "rota" | "cohabitacion" | "divorcio" | "parentChild"
      }}
    }}
  ]
}}

🚫 No incluyas razonamientos ni explicaciones. No escribas nada fuera del JSON.
✅ Responde solo con el objeto JSON en español.

Entrevista:
{transcripcion.strip()}

Responde ahora con el JSON:
"""
    return prompt

def generar_prompt_correccion(error_msg: str, respuesta_invalida: str) -> str:
    """
    Segundo prompt para pedirle al modelo que corrija el JSON, basado en el error
    y en el JSON defectuoso que devolvió la primera vez.
    """
    instrucciones_correccion = f"""
El JSON que proporcionaste no se pudo parsear correctamente.

Error detectado: {error_msg}

JSON defectuoso:
{respuesta_invalida}

Por favor, corrige este JSON para que sea válido, con la misma estructura solicitada
("nodes" y "edges") y devuélvelo nuevamente SIN texto adicional, solo el objeto JSON.
No expliques la corrección, solo devuélvelo con las claves, llaves y valores apropiados.
"""
    return instrucciones_correccion

def extract_family_structure(transcripcion: str) -> dict:
    """
    Llama al LLM para generar el genograma en JSON.
    Si la primera respuesta no es un JSON válido, hace una segunda llamada pidiendo corrección.
    """
    # ========== PRIMERA LLAMADA ==========
    prompt = generar_prompt_genograma(transcripcion)
    respuesta = consultar_ollama(prompt, modelo=LLM_MODEL_NAME)

    # Limpieza inicial (quitar triple backticks, comentarios, etc.)
    respuesta_limpia = _limpiar_respuesta(respuesta)

    # Intentar parsear la primera respuesta
    try:
        respuesta_json = _validar_y_parsear_json(respuesta_limpia)
    except Exception as e:
        # ========== SEGUNDA LLAMADA (CORRECCIÓN) ==========
        error_msg = str(e)
        prompt_correccion = generar_prompt_correccion(error_msg, respuesta_limpia)
        respuesta_corregida = consultar_ollama(prompt_correccion, modelo=LLM_MODEL_NAME)

        # Limpieza de la respuesta corregida
        respuesta_corregida_limpia = _limpiar_respuesta(respuesta_corregida)

        # Intentar parsear la respuesta corregida
        try:
            respuesta_json = _validar_y_parsear_json(respuesta_corregida_limpia)
        except Exception as e2:
            # Si vuelve a fallar, guardamos la respuesta final defectuosa y lanzamos excepción
            error_filename = f"respuesta_error_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt"
            with open(error_filename, "w", encoding="utf-8") as f:
                f.write(respuesta_corregida_limpia)
            raise Exception(
                f"Segunda corrección fallida: {str(e2)}\n"
                f"Respuesta corregida guardada en: {error_filename}"
            )

    # ========== SI LLEGAMOS AQUÍ, TENEMOS JSON VÁLIDO ==========
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"genograma_{timestamp}.json"
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(respuesta_json, f, indent=2, ensure_ascii=False)

    return {
        "modelo_usado": LLM_MODEL_NAME,
        "archivo": filename,
        "genograma": respuesta_json
    }

# ========== FUNCIONES AUXILIARES ==========

def _limpiar_respuesta(texto: str) -> str:
    """
    Aplica varias limpiezas a la respuesta:
    1. Elimina backticks ``` si están al inicio/final.
    2. Elimina comentarios de tipo //.
    3. Elimina espacios en blanco sobrantes.
    """
    # Quitar bloques de código al inicio/fin
    texto = re.sub(r"^```[a-zA-Z]*\n?", "", texto)
    texto = re.sub(r"\n?```$", "", texto)
    # Eliminar líneas con comentarios tipo //
    texto_limpio = "\n".join(line for line in texto.splitlines() if not line.strip().startswith("//"))
    return texto_limpio.strip()

def _validar_y_parsear_json(texto: str) -> dict:
    """
    Verifica si 'texto' parece un JSON válido con 'nodes' y 'edges'.
    Si no, lanza excepción. Si sí, devuelve el objeto JSON parseado.
    """
    # Validar si al menos comienza y termina con llaves
    if not (texto.startswith("{") and texto.endswith("}")):
        raise ValueError("La respuesta no tiene el formato JSON correcto (no inicia/cierra con llaves).")

    # Parsear
    parsed = json.loads(texto)

    # Verificar que existan las claves 'nodes' y 'edges'
    if not isinstance(parsed, dict) or "nodes" not in parsed or "edges" not in parsed:
        raise ValueError("El JSON no contiene las claves obligatorias 'nodes' y 'edges'.")
    return parsed
