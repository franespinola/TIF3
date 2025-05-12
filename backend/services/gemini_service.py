import requests
import json
import re
from datetime import datetime
import os # Necesario para manejar rutas de archivos y variables de entorno
import sys # Para salir del script en caso de errores críticos


API_KEY = "AIzaSyAvAF1YlyjWPPBCZMb5Af64pAbK8AxTybA"

MODEL = "gemini-2.5-pro-exp-03-25" #gemini-1.5-pro gemini-2.5-flash-preview-04-17 gemini-2.5-pro-exp-03-25

# También podés probar con "gemini-1.5-flash"

ENDPOINT = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent?key={API_KEY}"

# Nombre del archivo que contiene la transcripción de la entrevista
TRANSCRIPTION_FILENAME = "conversacion.txt" # Asegúrate que este archivo exista en la misma carpeta

# Carpetas para guardar salidas y errores
OUTPUT_FOLDER = "output"
ERROR_FOLDER = "errores"

# --- Funciones Auxiliares ---

def _limpiar_respuesta_json(texto: str) -> str:
    """
    Intenta extraer el bloque JSON de la respuesta del LLM.
    Elimina backticks de markdown y cualquier texto antes/después del JSON.
    Busca el JSON más grande posible delimitado por {}.
    """
    # Busca el patrón JSON más inclusivo (desde el primer { hasta el último })
    match = re.search(r'\{.*\}', texto, re.DOTALL)
    if match:
        json_text = match.group(0)
        # Quitar posible markdown de bloque de código ```json ... ``` o similar
        json_text = re.sub(r'^```[a-zA-Z]*\s*', '', json_text, flags=re.MULTILINE)
        json_text = re.sub(r'\s*```$', '', json_text, flags=re.MULTILINE)
        return json_text.strip()
    else:
        # Si no encuentra un bloque claro con {}, intenta limpiar backticks igualmente
        texto = re.sub(r'^```[a-zA-Z]*\s*', '', texto, flags=re.MULTILINE)
        texto = re.sub(r'\s*```$', '', texto, flags=re.MULTILINE)
        # Podría ser que el LLM solo devolvió el JSON sin adornos
        return texto.strip()

def _validar_y_parsear_json_genograma(texto: str) -> dict:
    """
    Valida si 'texto' es un JSON válido con las claves 'people' y 'relationships'.
    Si no, lanza una excepción clara. Si sí, devuelve el objeto JSON parseado.
    """
    if not texto:
         raise ValueError("La respuesta del LLM está vacía después de la limpieza.")

    # Intenta parsear primero, los errores de JSON son más informativos
    try:
        parsed = json.loads(texto)
    except json.JSONDecodeError as e:
        # Proporciona más contexto sobre el error de JSON
        # Muestra dónde ocurrió el error si es posible
        error_context = texto[max(0, e.pos - 30):min(len(texto), e.pos + 30)]
        raise ValueError(f"Error al parsear JSON: {e}. Cerca de la posición {e.pos}: '{error_context}...'. JSON recibido:\n---\n{texto}\n---")

    # Verificar la estructura específica del genograma
    if not isinstance(parsed, dict):
         raise TypeError("El JSON parseado no es un diccionario (objeto {}).") # TypeError es más específico
    if "people" not in parsed:
        raise ValueError("El JSON no contiene la clave obligatoria 'people'.")
    if "relationships" not in parsed:
        raise ValueError("El JSON no contiene la clave obligatoria 'relationships'.")
    if not isinstance(parsed["people"], list):
         raise TypeError("La clave 'people' debe ser una lista ([]).") # TypeError
    if not isinstance(parsed["relationships"], list):
         raise TypeError("La clave 'relationships' debe ser una lista ([]).") # TypeError

    # Validaciones adicionales (opcional pero recomendado)
    people_ids = set()
    for i, person in enumerate(parsed["people"]):
         person_id = person.get("id")
         if not person_id:
              print(f"WARN: Persona en índice {i} no tiene 'id'.")
              # Considera lanzar un error si el ID es estrictamente necesario
              # raise ValueError(f"Persona en índice {i} debe tener un 'id'.")
         else:
              if person_id in people_ids:
                   raise ValueError(f"El 'id' de persona '{person_id}' está duplicado.")
              people_ids.add(person_id)
         # Validar tipo de 'age' si existe
         if "age" in person and person["age"] is not None and not isinstance(person["age"], int):
              print(f"WARN: El campo 'age' para la persona '{person_id or i}' no es un número entero (es {type(person['age'])}). Se intentará usar.")
              # Podrías intentar convertirlo a int o lanzar un error si prefieres estricto:
              # try:
              #     person['age'] = int(person['age'])
              # except (ValueError, TypeError):
              #     raise TypeError(f"El campo 'age' para la persona '{person_id or i}' debe ser un número entero o null.")


    for i, rel in enumerate(parsed["relationships"]):
        rel_id = rel.get("id", f"rel_{i}") # Usar índice si falta ID de relación
        source_id = rel.get("source")
        target_id = rel.get("target")
        if not source_id or not target_id:
             raise ValueError(f"La relación '{rel_id}' no tiene 'source' o 'target'.")
        if source_id not in people_ids:
             raise ValueError(f"El 'source' ID '{source_id}' en la relación '{rel_id}' no existe en la lista 'people'.")
        if target_id not in people_ids:
             raise ValueError(f"El 'target' ID '{target_id}' en la relación '{rel_id}' no existe en la lista 'people'.")

    return parsed

def guardar_respuesta_error(texto: str, prefijo: str = "respuesta_error") -> str:
     """Guarda el texto en un archivo de error con timestamp y devuelve el nombre."""
     timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
     error_filename = f"{prefijo}_{timestamp}.txt"
     try:
         # Asegurar que el directorio de errores exista
         if not os.path.exists(ERROR_FOLDER):
             os.makedirs(ERROR_FOLDER)
         filepath = os.path.join(ERROR_FOLDER, error_filename)

         with open(filepath, "w", encoding="utf-8") as f:
             f.write(f"--- Error guardado el {timestamp} ---\n")
             f.write(texto)
         return filepath
     except Exception as e:
         print(f"\n\n[Error Interno] No se pudo guardar el archivo de error '{filepath}': {e}\n\n")
         return "(No se pudo guardar el archivo de error)"


# --- Funciones de Comunicación con la API y Generación de Prompts ---

def call_gemini_api(prompt: str) -> str:
    """
    Envía un prompt al endpoint de Gemini y devuelve la respuesta de texto.
    Maneja errores básicos de la API.
    """
    headers = {"Content-Type": "application/json"}
    data = {
        "contents": [{
            "role": "user",
            "parts": [{"text": prompt}]
        }],
        # --- Configuración Opcional de Generación ---
        "generationConfig": {
            "temperature": 0.6,          # 0.0-1.0: Más bajo = más determinista, más alto = más creativo
            "topP": 0.95,                # Controla diversidad vía nucleo de probabilidad
            "topK": 40,                  # Controla diversidad vía número de opciones
            "maxOutputTokens": 30000,     # Máximo de tokens en la respuesta (ajusta según necesidad)
            # "stopSequences": ["\n\n"] # Opcional: secuencias para detener la generación
        },
        # --- Configuración Opcional de Seguridad ---
        # Ajusta los umbrales de bloqueo si es necesario (BLOCK_NONE es permisivo)
        # "safetySettings": [
        #     {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
        #     {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
        #     {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
        #     {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
        # ]
    }

    try:
        # Timeout más largo por si la generación es compleja (en segundos)
        response = requests.post(ENDPOINT, headers=headers, data=json.dumps(data), timeout=600) # 3 minutos

        # Lanza excepción para errores HTTP 4xx/5xx (ej. 400 Bad Request, 401 Unauthorized, 429 Quota Exceeded, 500 Server Error)
        response.raise_for_status()

        response_data = response.json()

        # -- Procesamiento robusto de la respuesta de Gemini --
        if not response_data.get("candidates"):
            # Puede ocurrir si el prompt fue bloqueado completamente por seguridad o hubo otro error
            prompt_feedback = response_data.get("promptFeedback", {})
            block_reason = prompt_feedback.get("blockReason", "No especificada")
            safety_ratings = prompt_feedback.get("safetyRatings", [])
            error_details = response_data.get("error", {}) # A veces la API devuelve un objeto 'error'
            raise RuntimeError(f"Respuesta de Gemini bloqueada o vacía. Razón: {block_reason}. Ratings: {safety_ratings}. Detalles API: {error_details}. Respuesta completa: {response_data}")

        candidate = response_data["candidates"][0]

        # Verificar si la generación terminó normalmente o fue detenida por otras razones
        finish_reason = candidate.get("finishReason", "FINISH_REASON_UNSPECIFIED")
        if finish_reason not in ["STOP", "MAX_TOKENS"]:
             # Otras razones comunes: SAFETY, RECITATION, OTHER
             safety_ratings = candidate.get("safetyRatings", [])
             citation_metadata = candidate.get("citationMetadata", {}) # Si hay problemas de recitación
             raise RuntimeError(f"Generación de Gemini no completada normalmente. Razón: {finish_reason}. Safety Ratings: {safety_ratings}. Citations: {citation_metadata}. Respuesta: {response_data}")

        # Extraer el contenido generado
        if "content" in candidate and "parts" in candidate["content"] and candidate["content"]["parts"]:
             # Asegurarse de que la parte contenga 'text'
             if "text" in candidate["content"]["parts"][0]:
                 return candidate["content"]["parts"][0]["text"]
             else:
                 # Caso raro donde la parte existe pero no tiene texto
                 raise ValueError(f"Respuesta válida de Gemini pero la parte generada no contiene texto. Respuesta: {response_data}")
        else:
             # Situación inesperada si finish_reason fue STOP pero no hay contenido
             # Podría ocurrir si MAX_TOKENS fue 0 o muy bajo
             if finish_reason == "MAX_TOKENS":
                 return "" # Devolver vacío si se alcanzó max_tokens sin generar nada útil
             raise ValueError(f"Respuesta válida de Gemini ({finish_reason}) pero sin estructura de contenido esperada. Respuesta: {response_data}")

    except requests.exceptions.Timeout:
        raise TimeoutError(f"Timeout esperando respuesta de la API de Gemini (límite: 180s).")
    except requests.exceptions.RequestException as e:
        # Errores de conexión, DNS, HTTP (capturados por raise_for_status), etc.
        raise ConnectionError(f"Error de conexión o HTTP al llamar a la API de Gemini: {e}")
    except json.JSONDecodeError:
        # Si la respuesta de la API no es JSON válido (raro si status fue 200)
        raise ValueError(f"No se pudo decodificar la respuesta JSON de Gemini (inesperado para status 200). Status: {response.status_code}. Texto: {response.text}")
    except Exception as e:
        # Captura otras excepciones generales o las específicas ya lanzadas
        # Evita relanzar excepciones ya específicas como TimeoutError o ConnectionError
        if not isinstance(e, (TimeoutError, ConnectionError, ValueError, RuntimeError, TypeError)):
             raise RuntimeError(f"Error inesperado durante la llamada a la API de Gemini: {type(e).__name__} - {e}")
        else:
             raise e # Relanza la excepción específica ya capturada/creada


def generate_initial_prompt(transcripcion: str) -> str:
    """
    Genera el prompt inicial para extraer el genograma en formato JSON.
    *** VERSIÓN MODIFICADA PARA INCLUIR CAMPO 'age', TIPOS DE PÉRDIDAS GESTACIONALES Y POSICIONAMIENTO DE PAREJAS ***
    """
    current_year = datetime.now().year
    prompt = f"""
Eres un asistente experto en psicología familiar y tu tarea es convertir la siguiente transcripción de una entrevista en un esquema JSON estructurado y válido para un genograma. Sigue rigurosamente TODAS las instrucciones y sé EXHAUSTIVO.

####################  REGLAS DE INFERENCIA DE VÍNCULOS  ####################
Si detectas en la transcripción:

1. Frases de hostilidad, discusiones, "no nos hablamos", "en malos términos", etc. → asigna `"emotionalBond": "conflicto"`
2. Agresiones físicas o verbales, amenazas, "me pegó", "maltrato", "violencia" → asigna `"emotionalBond": "violencia"`
3. Frialdad afectiva o poca interacción, "somos distantes", "casi no hablamos" → asigna `"emotionalBond": "distante"`
4. Expresiones como "vivo con…", "convivimos", "compartimos casa" respecto de una pareja → crea la relación con `"type": "conyugal"` y `"legalStatus": "cohabitacion"`

Si varias reglas coinciden, prevalece la gravedad (violencia > conflicto > distante).
###########################################################################

####################  REGLAS DE DETECCIÓN DE PÉRDIDAS GESTACIONALES  ####################

Cuando detectes menciones sobre pérdidas de embarazos, asigna los siguientes valores según la terminología:

1. **Aborto espontáneo**: Si identificas términos como "pérdida natural", "pérdida del embarazo", "aborto espontáneo", "se le vino", "lo perdió sin querer", "pérdida involuntaria", etc. → asigna `"abortionType": "spontaneous"`, `"isAbortion": true`, `"isPregnancy": true`, `"isDeceased": true`

2. **Aborto provocado/voluntario**: Si identificas términos como "interrupción voluntaria", "aborto inducido", "decidió no tenerlo", "procedimiento para terminar el embarazo", etc. → asigna `"abortionType": "induced"`, `"isAbortion": true`, `"isPregnancy": true`, `"isDeceased": true`

3. **Mortinato/Feto muerto**: Si identificas términos como "nació muerto", "mortinato", "muerte intrauterina", "falleció en el útero", "muerte fetal tardía", "después de la semana 20", etc. → asigna `"abortionType": "stillbirth"`, `"isAbortion": true`, `"isPregnancy": true`, `"isDeceased": true`

4. **Género del feto**: Si se especifica el género del feto perdido → asigna el valor correspondiente en `"gender"` (M/F). Si no se especifica, usa `null`.

5. **Semanas de gestación**: Si se menciona información sobre el tiempo de gestación (ej: "estaba de 8 semanas", "perdió el bebé a los 5 meses", etc.) → calcula y asigna el valor numérico en semanas a `"gestationalAge"`.

Cuando se mencione cualquier tipo de pérdida gestacional:
- Crea un nodo específico para representarla
- Establece la relación `parentChild` con el progenitor o progenitores mencionados
- Utiliza un formato de `id` descriptivo (ej: "a1_aborto_maria", "s1_mortinato_pedro_ana")
- En el campo `name`, utiliza un formato descriptivo según el tipo (ej: "Aborto espontáneo de María", "Mortinato de Ana y Pedro")
###########################################################################

####################  REGLAS DE AGRUPACIÓN DE PAREJAS  ####################
Para garantizar una visualización adecuada del genograma, asigna información de posicionamiento especial:

1. Para cada relación conyugal (matrimonio, cohabitación, separación, etc.):
   - Identifica los dos miembros de la pareja
   - Asigna a cada uno de ellos un metadato adicional:
     * Añade en cada persona un campo `"displayGroup": "nombre_de_grupo"` donde "nombre_de_grupo" es un identificador de la pareja
     * Utiliza el mismo valor de "displayGroup" para ambos miembros de la pareja
     * Puedes usar formatos como "pareja_juan_maria", "matrimonio_perez_lopez" o simplemente "p1", "p2", etc.

2. Para parejas separadas o divorciadas:
   - Si quieres que aparezcan separadas visualmente, NO les asignes el mismo "displayGroup"
   - Si prefieres que se visualicen juntas pese a estar separadas, asígnales el mismo "displayGroup"

Esto permitirá que el sistema de visualización mantenga juntas las parejas en el genograma.
###########################################################################

**Instrucciones Críticas:**

1.  **Formato de Salida Exclusivo:** Tu respuesta DEBE ser **únicamente** un objeto JSON válido. No incluyas NINGÚN texto antes o después del JSON. Esto incluye:
    * NO saludos (Hola, Aquí tienes el JSON, etc.)
    * NO explicaciones o comentarios fuera del JSON.
    * NO markdown como \`\`\`json ... \`\`\` o \`\`\` ... \`\`\`.
    * La respuesta debe empezar directamente con `{{` y terminar con `}}`.

2.  **Estructura Raíz del JSON:** El objeto JSON debe tener exactamente dos claves en el nivel superior:
    * `"people"`: Una lista (`[]`) de objetos persona/evento.
    * `"relationships"`: Una lista (`[]`) de objetos vínculo.

3.  **Estructura del Objeto Persona (`people`):** Cada objeto en la lista `"people"` debe tener **exactamente** las siguientes claves:
    * `"id"`: (String) Identificador único y descriptivo (ej: "p1_persona1", "p2_persona2", "a1_evento"). NO uses solo números. Debe ser único dentro de la lista 'people'.
    * `"name"`: (String) Nombre completo o etiqueta clara (ej: "Juan Pérez (Paciente)", "María López", "Evento Importante 1"). NO inventes palabras.
    * `"gender"`: (String) "M" (masculino), "F" (femenino). Usa `null` si el sexo es desconocido (ej: aborto temprano).
    * `"generation"`: (Number) Número de generación (ej: 5 para nietos del paciente, 4 hijos del paciente y sobrinos, 3 para el paciente, sus hermanos y primos, 2 para padres del paciente y tíos, 1 para los abuelos del paciente).
    * `"birthDate"`: (String | null) Fecha en formato "YYYY-MM-DD". **Calcula un año aproximado si solo se da la edad** (asume el año actual {current_year}) para tener una referencia temporal. Si no hay información para calcularla, usa `null`.
    * `"age"`: (Number | null) **La edad NUMÉRICA mencionada explícitamente** en la transcripción (ej: si dice "53 años", el valor debe ser `53`). Usa `null` si no se menciona la edad explícitamente.
    * `"deathDate"`: (String | null) Fecha de fallecimiento "YYYY-MM-DD". Usa `null` si está viva o no aplica.
    * `"role"`: (String) Rol específico relativo al paciente (ej: "paciente", "padre", "madre", "hermana", "tia_materna", "tio_paterno_mellizo", "primo_materno", "aborto_materno"). Sé lo más específico posible.
    * `"notes"`: (String) Otras observaciones relevantes extraídas DIRECTAMENTE de la transcripción (ej: "Separado hace 1.5 años", "Mayor de 5 hermanos", "Mellizo de Francisco"). **No incluyas la edad aquí si ya está en el campo 'age'**. Si no hay notas adicionales, usa "".
    * `"displayGroup"`: (String | null) Identificador de grupo para posicionamiento visual. Usa el mismo valor para ambos miembros de una pareja. Usa `null` si no aplica.
    * `"attributes"`: (Object) Objeto con banderas booleanas. **Todas** deben estar presentes:
        * `"isPatient"`: (Boolean) `true` solo para el nodo del paciente principal (identifica quién es en la transcripción), `false` para todos los demás.
        * `"isDeceased"`: (Boolean) `true` si ha fallecido, `false` en caso contrario.
        * `"isPregnancy"`: (Boolean) Normalmente `false`. Usar `isAbortion` o `isDeceased` para resultados específicos.
        * `"isAbortion"`: (Boolean) `true` si representa un aborto, `false` en caso contrario.
        * `"isAdopted"`: (Boolean) `true` si es adoptado, `false` en caso contrario.
        * `"abortionType"`: (String | null) **Obligatorio cuando `isAbortion` es `true`**. Valores permitidos: 
            * `"spontaneous"` (aborto espontáneo, pérdida natural)
            * `"induced"` (aborto provocado o voluntario)
            * `"stillbirth"` (mortinato, feto muerto después de semana 20)
            * `"unknown"` (cuando se menciona un aborto pero no se especifica el tipo)
            * `null` cuando `isAbortion` es `false`.
        * `"gestationalAge"`: (Number | null) Semanas de gestación cuando se produjo la pérdida, si se menciona (ej: 8, 24). Usar `null` si no se especifica.

4.  **Estructura del Objeto Relación (`relationships`):** Cada objeto en `"relationships"` debe tener **exactamente** las siguientes claves:
    * `"id"`: (String) Identificador único y descriptivo para la relación (ej: "r1_padres_paciente", "r2_padres_separacion", "r3_paciente_hermana"). Debe ser único dentro de la lista 'relationships'.
    * `"source"`: (String) El `id` de la persona 'origen'. **Importante**: Para `parentChild`, DEBE ser el `id` del **hijo/a**. Para `conyugal`, uno de los miembros. Debe existir en la lista 'people'.
    * `"target"`: (String) El `id` de la persona 'destino'. **Importante**: Para `parentChild`, DEBE ser el `id` del **padre o madre**. Para `conyugal`, el otro miembro. Debe existir en la lista 'people'.
    * `"type"`: (String) Tipo fundamental. **Valores Clave**: `"parentChild"` (padre/madre a hijo/a), `"conyugal"` (para TODAS las relaciones de pareja: casados, separados, divorciados, convivientes, etc.), `"hermanos"`, `"mellizos"`. **NO uses otros tipos.**
    * `"legalStatus"`: (String | null) **Obligatorio para `type: "conyugal"`**. Valores permitidos: `"matrimonio"`, `"divorcio"`, `"separacion"`, `"cohabitacion"`, `"compromiso"`. Usa `null` solo si `type` no es `"conyugal"` o si, siendo conyugal, no se especifica el estado legal.
    * `"emotionalBond"`: (String | null) Calidad del vínculo si se menciona explícitamente. Valores permitidos: `"conflicto"`, `"cercana"`, `"distante"`, `"violencia"`, `"rota"`. Usa `null` si no hay información en la transcripción.
    * `"startDate"`: (String | null) Fecha inicio "YYYY-MM-DD". Usa `null` si no se sabe.
    * `"endDate"`: (String | null) Fecha fin "YYYY-MM-DD" (ej: para separación, divorcio). Usa `null` si no se sabe o sigue activa.
    * `"notes"`: (String) Notas sobre la relación directamente de la transcripción (ej: "Separados hace 1 año y medio"). Usa "" si no hay notas. Establece SIEMPRE la relación "parentChild" entre cada tío/tía del paciente y sus respectivos padres (los abuelos del paciente).

5.  **Datos Específicos a Extraer (Revisión Detallada):**
    * Identifica al paciente principal (`"isPatient": true`).
    * **Rellena el campo `"age"` con la edad numérica si se menciona explícitamente en la transcripción.**
    * Calcula y rellena `"birthDate"` de forma aproximada si es posible (basado en edad o contexto).
    * Modela cualquier aborto mencionado (`isAbortion: true`) y su relación `parentChild`.
    * Modela TODAS las relaciones de pareja (actuales y pasadas) usando `type: "conyugal"` y el `legalStatus` adecuado.
    * **Asigna el mismo `"displayGroup"` a cada miembro de una pareja** para que se visualicen juntos.
    * Identifica a **TODOS** los tíos/tías, primos, hermanos, etc. mencionados. Crea nodos para ellos.
    * Establece las relaciones `parentChild` y de hermandad (`hermanos`, `mellizos`) correspondientes.
    * Asegúrate de que **todos** los `id` referenciados en `relationships` (`source`, `target`) existan en la lista `people`.

6.  **Exhaustividad Crucial:** Es VITAL que identifiques **TODAS** las personas mencionadas y **TODAS** las relaciones familiares implícitas o explícitas en el texto. Presta atención a detalles sutiles. **Antes de finalizar, revisa mentalmente tu JSON generado comparándolo línea por línea con la transcripción para asegurar que no falte ninguna persona, edad mencionada, ni relación.**

**Transcripción de la Entrevista:**
```text
{transcripcion}
```

**Genera ahora únicamente el objeto JSON válido, completo y exhaustivo, siguiendo todas las reglas estrictamente.**
"""
    return prompt.strip()


def generate_correction_prompt(error_msg: str, invalid_response: str, original_transcription: str) -> str:
    """
    Genera el prompt para pedirle al LLM que corrija un JSON inválido,
    reiterando las reglas más importantes.
    """
    prompt = f"""
Tu tarea anterior era generar un JSON para un genograma a partir de una transcripción.
Sin embargo, la respuesta que proporcionaste contenía errores y no pudo ser procesada.

**Error detectado:**
{error_msg}

**JSON inválido que generaste (puede estar incompleto o malformado):**
```json
{invalid_response}
```

**Instrucciones Urgentes para la Corrección:**

1.  **Analiza el Error:** Revisa cuidadosamente el mensaje de error y compáralo con el JSON inválido que produjiste. Identifica dónde fallaste (estructura incorrecta, claves faltantes/extras, tipo de dato erróneo, sintaxis JSON inválida, texto fuera del JSON, etc.).
2.  **Revisa las Reglas Originales:** Necesitas cumplir **todas** las reglas de la solicitud inicial, especialmente:
    * Responder **solo** con el objeto JSON, empezando con `{{` y terminar con `}}`. Sin texto adicional ni markdown \`\`\`.
    * El JSON debe tener **solo** las claves `"people"` (lista) y `"relationships"` (lista) en la raíz.
    * Cada objeto en `"people"` debe tener **todas** las claves requeridas (`id`, `name`, `gender`, `generation` , `birthDate`, `deathDate`, `role`, `notes`, `attributes` con todas sus sub-claves booleanas).
    * Cada objeto en `"relationships"` debe tener **todas** las claves requeridas (`id`, `source`, `target`, `type`, `legalStatus`, `emotionalBond`, `startDate`, `endDate`, `notes`).
    * Los valores deben tener los tipos de datos correctos (String, Number, Boolean, null, Lista, Objeto).
    * Los `id` en `relationships` deben coincidir con `id` existentes en `people`.
3.  **Corrige el JSON:** Reescribe el JSON completo desde cero si es necesario, asegurándote de que sea sintácticamente válido y cumpla todas las reglas estructurales y de contenido basadas en la transcripción original.
4.  **No Expliques:** No añadas explicaciones sobre la corrección ni ningún otro texto. Tu respuesta debe ser **exclusivamente el JSON corregido**. Verifica que existan relaciones "parentChild" entre todos los tíos/tías del paciente y sus padres (abuelos).

**Transcripción Original (para referencia):**
```text
{original_transcription}
```

**Ahora, proporciona únicamente el objeto JSON corregido, completo y válido:**
"""
    return prompt.strip()


# --- Lógica Principal con Patrón de Reflexión ---

def extract_genogram_with_reflection(transcripcion: str, max_attempts: int = 2) -> dict:
    """
    Llama al LLM para generar el genograma en JSON.
    Implementa el patrón de Reflexión: si la respuesta no es un JSON válido
    o no tiene la estructura correcta, hace llamadas adicionales pidiendo corrección.
    """
    if max_attempts < 1:
        raise ValueError("max_attempts debe ser al menos 1.")

    last_error = None
    last_invalid_response = "" # Guardar la última respuesta aunque sea inválida

    for attempt in range(1, max_attempts + 1):
        print(f"\n--- Intento {attempt} de {max_attempts} ---")

        try:
            # 1. Generar el prompt adecuado
            if attempt == 1:
                print("1. Generando prompt inicial...")
                prompt = generate_initial_prompt(transcripcion)
            else: # Intento de corrección
                # Asegurarse de que hay un error previo para generar el prompt de corrección
                if last_error:
                    error_type_name = type(last_error).__name__
                    print(f"1. Generando prompt de corrección (basado en error anterior: {error_type_name})...")
                    prompt = generate_correction_prompt(str(last_error), last_invalid_response, transcripcion)
                else:
                    # Esto no debería ocurrir si la lógica es correcta, pero por si acaso
                    print("WARN: Intento de corrección sin error previo registrado. Usando prompt inicial.")
                    prompt = generate_initial_prompt(transcripcion)


            # 2. Llamar a la API
            print("2. Llamando a la API de Gemini...")
            raw_response = call_gemini_api(prompt)
            last_invalid_response = raw_response # Guardar por si falla la validación
            print("   Respuesta recibida de la API.")
            # Descomentar para depuración intensa: muestra los primeros 500 caracteres
            # print(f"   Respuesta bruta (primeros 500 chars):\n   {raw_response[:500]}...")

            # 3. Limpiar la respuesta para aislar el JSON
            print("3. Limpiando respuesta...")
            cleaned_response = _limpiar_respuesta_json(raw_response)
            # Descomentar para depuración
            # print(f"   Respuesta limpia (primeros 500 chars):\n   {cleaned_response[:500]}...")

            # 4. Validar y parsear el JSON
            print("4. Validando y parseando JSON...")
            final_json_data = _validar_y_parsear_json_genograma(cleaned_response)
            print("✅ ¡JSON validado y parseado con éxito!")

            # Si llegamos aquí, el JSON es válido, retornamos el resultado
            return {
                "status": "success",
                "attempts_made": attempt,
                "model_used": MODEL,
                "genogram_data": final_json_data
            }

        except (ValueError, TypeError, ConnectionError, TimeoutError, RuntimeError, Exception) as e:
            # Captura errores de validación, API, conexión, etc.
            print(f"❌ Error en el intento {attempt}: {type(e).__name__} - {e}")
            last_error = e # Guardar el error para el próximo intento o para el final

            # Guardar la respuesta bruta que causó el error para depuración
            if last_invalid_response: # Solo guarda si hubo una respuesta
                 error_file = guardar_respuesta_error(last_invalid_response, f"respuesta_error_intento_{attempt}")
                 print(f"   Respuesta (potencialmente inválida) guardada en: {error_file}")
            else:
                 print("   No hubo respuesta de la API para guardar (posible error de conexión o timeout previo).")

            # Si es el último intento, el bucle terminará y se lanzará la excepción abajo
            if attempt == max_attempts:
                 print(f"\nSe alcanzó el número máximo de intentos ({max_attempts}). Fallo final.")
                 # Relanza el último error ocurrido para que el llamador lo maneje
                 raise last_error


# --- Ejecución Principal ---

if __name__ == "__main__":
    print("*" * 60)
    print("   Iniciando Proceso de Extracción de Genograma con Reflexión   ")
    print("*" * 60)

    # Crear carpetas de salida si no existen
    if not os.path.exists(OUTPUT_FOLDER):
        os.makedirs(OUTPUT_FOLDER)
    if not os.path.exists(ERROR_FOLDER):
        os.makedirs(ERROR_FOLDER)

    # Cargar la transcripción desde el archivo .txt
    transcription_text = ""
    filepath_transcription = os.path.join(TRANSCRIPTION_FILENAME) # Asume archivo en la misma carpeta

    try:
        print(f"\nCargando transcripción desde '{filepath_transcription}'...")
        if not os.path.exists(filepath_transcription):
             raise FileNotFoundError(f"El archivo '{filepath_transcription}' no existe.")

        with open(filepath_transcription, "r", encoding="utf-8") as f:
            transcription_text = f.read()

        if not transcription_text.strip():
             print(f"❌ Error Crítico: El archivo de transcripción '{filepath_transcription}' está vacío.")
             sys.exit(1)
        print("   Transcripción cargada exitosamente.")

    except FileNotFoundError as e:
        print(f"❌ Error Crítico: {e}")
        print(f"   Por favor, asegúrate de que el archivo '{TRANSCRIPTION_FILENAME}' exista en el mismo directorio que el script.")
        sys.exit(1) # Termina el script si no encuentra el archivo
    except Exception as e:
        print(f"❌ Error Crítico al leer el archivo '{filepath_transcription}': {type(e).__name__} - {e}")
        sys.exit(1)

    # Llamar a la función principal que incluye la lógica de reflexión
    final_result = None
    try:
        # Puedes cambiar el número de intentos si lo deseas (ej. max_attempts=3)
        final_result = extract_genogram_with_reflection(transcription_text, max_attempts=2)

        # --- Guardar el JSON válido ---
        if final_result and final_result["status"] == "success":
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            output_filename = f"genograma_final_{timestamp}.json"
            filepath_output = os.path.join(OUTPUT_FOLDER, output_filename)

            try:
                with open(filepath_output, "w", encoding="utf-8") as f:
                    # indent=2 para formato legible, ensure_ascii=False para caracteres UTF-8
                    json.dump(final_result["genogram_data"], f, indent=2, ensure_ascii=False)
                print(f"\n✅ Genograma guardado exitosamente en: {filepath_output}")

                # Imprimir resumen del éxito
                print("\n--- Resumen del Proceso ---")
                print(f"Estado: {final_result['status']}")
                print(f"Intentos Realizados: {final_result['attempts_made']}")
                print(f"Modelo Utilizado: {final_result['model_used']}")
                print(f"Archivo de Salida: {filepath_output}")
                # Opcional: Mostrar número de personas/relaciones
                people_count = len(final_result['genogram_data'].get('people', []))
                rel_count = len(final_result['genogram_data'].get('relationships', []))
                print(f"Elementos Generados: {people_count} personas/eventos, {rel_count} relaciones.")

            except Exception as e:
                 # Si falla al guardar el archivo final (problemas de permisos, disco lleno, etc.)
                 print("\n--- Advertencia ---")
                 print(f"⚠️ El JSON se generó correctamente, pero hubo un error al guardarlo en '{filepath_output}': {type(e).__name__} - {e}")
                 print("   Puedes intentar copiar el JSON de la salida de depuración si estaba habilitada.")
                 # Podrías imprimir el JSON aquí si quieres recuperarlo de la consola
                 # print("\n--- JSON Generado (no guardado) ---")
                 # print(json.dumps(final_result['genogram_data'], indent=2, ensure_ascii=False))

    except Exception as e:
        # Captura la excepción final relanzada por extract_genogram_with_reflection
        print("\n" + "="*60)
        print("   PROCESO FALLIDO DESPUÉS DE TODOS LOS INTENTOS")
        print("="*60)
        print(f"❌ Error final: {type(e).__name__} - {e}")
        print(f"   Revisa los archivos '.txt' en la carpeta '{ERROR_FOLDER}/' (si se crearon)")
        print("   para ver las respuestas inválidas de la API que causaron los fallos.")
        print("   Puede que necesites ajustar el prompt, los parámetros del modelo,")
        print("   o verificar tu conexión y cuota de API.")

    finally:
        # Este bloque se ejecuta siempre, haya error o no
        print("\n" + "*"*60)
        print("   Proceso de extracción de genograma completado.   ")
        print("*" * 60)
