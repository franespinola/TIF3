# 🧬 Genograma Backend (FastAPI + Whisper + Pyannote + DeepSeek)

Este backend procesa entrevistas clínicas grabadas y genera genogramas automatizados en formato JSON, listos para ser visualizados con React Flow.

---

## 🚀 Tecnologías utilizadas

- **FastAPI** – Framework web para APIs rápidas y modernas
- **Faster-Whisper** – Transcripción de voz optimizada por GPU
- **Pyannote-audio** – Diarización automática (identificación de hablantes)
- **Ollama + DeepSeek R1 14B** – Extracción de estructura familiar desde texto
- **Pydub + FFmpeg** – Procesamiento y división de audio

---

## ⚙️ Instalación local

```bash
# 1. Clona el repositorio o ubicáte en la carpeta backend
cd backend

# 2. Crea y activa entorno virtual
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 3. Instala dependencias
pip install -r requirements.txt

# 4. Agregá un archivo .env
```

**.env**
```env
HUGGINGFACE_TOKEN=hf_tu_token_aqui
```

---

## ▶️ Ejecución

```bash
uvicorn main:app --reload
```

API disponible en: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🧪 Endpoints disponibles

| Método | Ruta              | Función                                                                 |
|--------|-------------------|------------------------------------------------------------------------|
| POST   | `/upload-audio`   | Sube un archivo `.wav` y lo guarda temporalmente                       |
| POST   | `/transcribe`     | Diariza + transcribe el audio (requiere `file_id`)                     |
| POST   | `/extract-genogram` | Genera JSON del genograma desde texto transcripto                     |
| POST   | `/full-process`   | Subí un `.wav` y obtené el JSON de genograma en un solo paso           |

---

## 🧠 Flujo del procesamiento

1. 🎙️ **Grabás una entrevista**
2. 🔊 **Se sube el audio** al backend
3. 🧑‍🏫 **Se identifican los hablantes** (diarización)
4. ✍️ **Se transcribe cada fragmento**
5. 🤖 **Se extrae la estructura familiar** con DeepSeek R1
6. 🧬 **Se genera el JSON para el genograma**
7. 🖼️ **El frontend React Flow lo muestra visualmente**

---

## 📂 Estructura del proyecto
```
backend/
├── main.py
├── .env
├── requirements.txt
├── README.md
├── temp_uploads/           # Archivos temporales de audio
└── modules/
    ├── transcriber.py      # Transcripción + diarización
    └── deepseek_processor.py # Extracción de estructura familiar
```

---

## ✅ Requisitos adicionales

- Tener instalado **Ollama** y el modelo `deepseek:14b` ya descargado.
- Tener instalado **FFmpeg** en el sistema (usado por `pydub`).

---

¡Listo para usar! Cualquier profesional de la salud podrá generar genogramas desde entrevistas clínicas sin esfuerzo. 🧑‍⚕️🎧🧬
