from app.core.tokenConfigs import HUGGINGFACE_TOKEN
from services.whisperx_service import transcribir_con_whisperx
from services.gemini_service import extract_genogram_with_reflection
from services.summary_service import generate_session_summary, save_session_summary
import os, json
from datetime import datetime, timezone

def generate_summary_async(texto: str, patient_dir: str, ts: str, session_id: str = None):
    """
    Función asíncrona para generar y guardar el resumen de una sesión.
    Si se proporciona un session_id, actualiza ese registro en la base de datos.
    """
    try:
        print(f"Iniciando generación asíncrona de resumen...")
        summary_result = generate_session_summary(texto)
        
        if summary_result["status"] == "success":
            summary_text = summary_result.get("summary_text", "")
            summary_path = save_session_summary(summary_text, patient_dir, ts)
            print(f"✅ Resumen generado y guardado en: {summary_path}")
            
            # Si tenemos un session_id, actualizamos el registro en la base de datos
            if session_id:
                from sqlalchemy.orm import sessionmaker
                from app.core.database import engine
                from app.models import Session as SessionModel
                
                # Crear una sesión de base de datos
                DBSession = sessionmaker(autocommit=False, autoflush=False, bind=engine)
                db = DBSession()
                
                try:
                    # Buscar y actualizar el registro de la sesión
                    session_record = db.query(SessionModel).filter(SessionModel.id == session_id).first()
                    if session_record:
                        session_record.summary = summary_text
                        db.commit()
                        print(f"✅ Registro de sesión {session_id} actualizado con el resumen")
                    else:
                        print(f"❌ No se encontró el registro de sesión con ID {session_id}")
                except Exception as db_error:
                    print(f"❌ Error actualizando la base de datos: {str(db_error)}")
                finally:
                    db.close()
        else:
            print(f"❌ Error generando resumen: {summary_result.get('error_message', 'Error desconocido')}")
    except Exception as e:
        print(f"❌ Error en el proceso asíncrono de resumen: {str(e)}")

def process_audio(content: bytes, filename: str, patient: str) -> dict:
    """
    Orquesta y guarda todo en carpeta Pacientes/{patient}:
    - audio
    - transcripción .txt
    - genograma .json
    - resumen .txt (generado asíncronamente)
    """
    # 1. Preparar carpeta del paciente
    base_dir = os.path.dirname(__file__)
    pacientes_dir = os.path.abspath(os.path.join(base_dir, '../Pacientes'))
    patient_dir = os.path.join(pacientes_dir, patient)
    os.makedirs(patient_dir, exist_ok=True)
    # Timestamp para nombres únicos
    ts = datetime.now(timezone.utc).strftime("%Y%m%d%H%M%S")

    # 2. Guardar audio
    safe_filename = f"{ts}_{filename}"
    audio_path = os.path.join(patient_dir, safe_filename)
    with open(audio_path, 'wb') as f:
        f.write(content)

    # 3. Transcribir con WhisperX
    segmentos = transcribir_con_whisperx(audio_path, hf_token=HUGGINGFACE_TOKEN)
    texto = "\n".join(
        f"{seg.get('speaker', 'SPEAKER_??')}: {seg.get('text', '').strip()}"
        for seg in segmentos
    )    # Guardar transcripción completa
    txt_name = f"transcripcion_{ts}.txt"
    transcription_path = os.path.join(patient_dir, txt_name)
    with open(transcription_path, 'w', encoding='utf-8') as f:
        f.write(texto)
        
    # 4. Iniciar proceso asíncrono para generar resumen ANTES del genograma
    # El session_id se añadirá más tarde, después de crear la sesión en la base de datos
    thread = None  # Inicializamos thread como None, lo iniciaremos después de crear el registro de sesión    # 5. Intentar generar genograma
    genogram_result = None
    genogram_path = None
    try:
        genogram_result = extract_genogram_with_reflection(texto)
        data = genogram_result.get('genogram_data', {})
        json_name = f"genograma_{ts}.json"
        genogram_path = os.path.join(patient_dir, json_name)
        with open(genogram_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
    except Exception as e:
        print(f"❌ Error generando genograma: {str(e)}")
        # No lanzamos la excepción, continuamos con la respuesta
        
    result = {
        'patient_dir': patient_dir,
        'recording_path': audio_path,
        'transcription_path': transcription_path,
        'genogram_path': genogram_path,
        'transcription': texto,
        'genogram': genogram_result,
        'summary_pending': True,  # Indicar que el resumen está en proceso
        'session_id': None,  # Este valor se actualizará desde el endpoint
        'texto': texto,  # Para que el endpoint tenga acceso al texto transcrito
        'ts': ts  # Para que el endpoint pueda usar el mismo timestamp
    }
    
    return result