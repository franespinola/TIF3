import json
import os
from datetime import datetime
from typing import Dict, List, Optional, Any
import uuid

# Rutas base para almacenamiento de datos
DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data")
PATIENTS_DIR = os.path.join(DATA_DIR, "patients")
GENOGRAMS_DIR = os.path.join(DATA_DIR, "genograms")
CLINICAL_DIR = os.path.join(DATA_DIR, "clinical")
APPOINTMENTS_DIR = os.path.join(DATA_DIR, "appointments")

# Asegurar que los directorios existan
for dir_path in [DATA_DIR, PATIENTS_DIR, GENOGRAMS_DIR, CLINICAL_DIR, APPOINTMENTS_DIR]:
    os.makedirs(dir_path, exist_ok=True)

# Funciones auxiliares
def _generate_id() -> str:
    return str(uuid.uuid4())

def _load_json(file_path: str) -> Dict:
    if not os.path.exists(file_path):
        return {}
    with open(file_path, "r") as f:
        return json.load(f)

def _save_json(file_path: str, data: Dict) -> None:
    with open(file_path, "w") as f:
        json.dump(data, f, indent=2, default=str)

# Funciones para la gestión de pacientes
def get_patients() -> List[Dict]:
    patients = []
    for file_name in os.listdir(PATIENTS_DIR):
        if file_name.endswith('.json'):
            file_path = os.path.join(PATIENTS_DIR, file_name)
            patient_data = _load_json(file_path)
            patients.append(patient_data)
    return patients

def get_patient(patient_id: str) -> Optional[Dict]:
    file_path = os.path.join(PATIENTS_DIR, f"{patient_id}.json")
    if not os.path.exists(file_path):
        return None
    return _load_json(file_path)

def create_patient(patient_data: Dict) -> Dict:
    patient_id = _generate_id()
    patient_data["id"] = patient_id
    patient_data["first_visit"] = datetime.now()
    patient_data["last_visit"] = datetime.now()
    
    file_path = os.path.join(PATIENTS_DIR, f"{patient_id}.json")
    _save_json(file_path, patient_data)
    
    # Crear directorios para los archivos del paciente
    os.makedirs(os.path.join(os.path.dirname(os.path.abspath(__file__)), f"Pacientes/{patient_data['name']}"), exist_ok=True)
    
    return patient_data

def update_patient(patient_id: str, patient_data: Dict) -> Optional[Dict]:
    file_path = os.path.join(PATIENTS_DIR, f"{patient_id}.json")
    if not os.path.exists(file_path):
        return None
        
    existing_data = _load_json(file_path)
    updated_data = {**existing_data, **patient_data}
    _save_json(file_path, updated_data)
    
    return updated_data

def delete_patient(patient_id: str) -> bool:
    file_path = os.path.join(PATIENTS_DIR, f"{patient_id}.json")
    if not os.path.exists(file_path):
        return False
    
    os.remove(file_path)
    return True

# Funciones para la gestión de medicaciones
def get_medications(patient_id: str) -> List[Dict]:
    patient = get_patient(patient_id)
    if not patient:
        return []
    
    return patient.get("medications", [])

def add_medication(patient_id: str, medication_data: Dict) -> Optional[Dict]:
    patient = get_patient(patient_id)
    if not patient:
        return None
    
    medications = patient.get("medications", [])
    medication_id = _generate_id()
    medication = {
        "id": medication_id,
        **medication_data
    }
    
    medications.append(medication)
    patient["medications"] = medications
    
    file_path = os.path.join(PATIENTS_DIR, f"{patient_id}.json")
    _save_json(file_path, patient)
    
    return medication

# Funciones para genogramas
def get_genograms(patient_id: str = None) -> List[Dict]:
    genograms = []
    for file_name in os.listdir(GENOGRAMS_DIR):
        if file_name.endswith('.json'):
            file_path = os.path.join(GENOGRAMS_DIR, file_name)
            genogram_data = _load_json(file_path)
            if patient_id is None or genogram_data.get("patient_id") == patient_id:
                genograms.append(genogram_data)
    return genograms

def get_genogram(genogram_id: str) -> Optional[Dict]:
    file_path = os.path.join(GENOGRAMS_DIR, f"{genogram_id}.json")
    if not os.path.exists(file_path):
        return None
    return _load_json(file_path)

def create_genogram(genogram_data: Dict) -> Dict:
    genogram_id = _generate_id()
    now = datetime.now()
    genogram_complete = {
        "id": genogram_id,
        "created_at": now,
        "last_modified": now,
        **genogram_data
    }
    
    file_path = os.path.join(GENOGRAMS_DIR, f"{genogram_id}.json")
    _save_json(file_path, genogram_complete)
    
    return genogram_complete

def update_genogram(genogram_id: str, genogram_data: Dict) -> Optional[Dict]:
    file_path = os.path.join(GENOGRAMS_DIR, f"{genogram_id}.json")
    if not os.path.exists(file_path):
        return None
        
    existing_data = _load_json(file_path)
    updated_data = {**existing_data, **genogram_data, "last_modified": datetime.now()}
    _save_json(file_path, updated_data)
    
    return updated_data

# Funciones para historia clínica
def get_clinical_entries(patient_id: str) -> List[Dict]:
    entries = []
    clinical_dir = os.path.join(CLINICAL_DIR, patient_id)
    
    if not os.path.exists(clinical_dir):
        os.makedirs(clinical_dir, exist_ok=True)
        return []
    
    for file_name in os.listdir(clinical_dir):
        if file_name.endswith('.json'):
            file_path = os.path.join(clinical_dir, file_name)
            entry_data = _load_json(file_path)
            entries.append(entry_data)
    
    # Ordenar por fecha, más reciente primero
    return sorted(entries, key=lambda x: x.get("date", ""), reverse=True)

def create_clinical_entry(entry_data: Dict) -> Dict:
    patient_id = entry_data.get("patient_id")
    clinical_dir = os.path.join(CLINICAL_DIR, patient_id)
    os.makedirs(clinical_dir, exist_ok=True)
    
    entry_id = _generate_id()
    now = datetime.now()
    
    if "date" not in entry_data:
        entry_data["date"] = now
        
    complete_entry = {
        "id": entry_id,
        **entry_data,
        "created_at": now
    }
    
    file_path = os.path.join(clinical_dir, f"{entry_id}.json")
    _save_json(file_path, complete_entry)
    
    return complete_entry

# Funciones para citas
def get_appointments(patient_id: str = None) -> List[Dict]:
    appointments = []
    
    for file_name in os.listdir(APPOINTMENTS_DIR):
        if file_name.endswith('.json'):
            file_path = os.path.join(APPOINTMENTS_DIR, file_name)
            appointment_data = _load_json(file_path)
            if patient_id is None or appointment_data.get("patient_id") == patient_id:
                appointments.append(appointment_data)
    
    # Ordenar por fecha, más próxima primero
    return sorted(appointments, key=lambda x: x.get("date_time", ""))

def create_appointment(appointment_data: Dict) -> Dict:
    appointment_id = _generate_id()
    
    complete_appointment = {
        "id": appointment_id,
        "status": "scheduled",
        "created_at": datetime.now(),
        **appointment_data
    }
    
    file_path = os.path.join(APPOINTMENTS_DIR, f"{appointment_id}.json")
    _save_json(file_path, complete_appointment)
    
    return complete_appointment

def update_appointment(appointment_id: str, appointment_data: Dict) -> Optional[Dict]:
    file_path = os.path.join(APPOINTMENTS_DIR, f"{appointment_id}.json")
    if not os.path.exists(file_path):
        return None
        
    existing_data = _load_json(file_path)
    updated_data = {**existing_data, **appointment_data}
    _save_json(file_path, updated_data)
    
    return updated_data

# Función para obtener transcripciones y grabaciones
def get_recordings(patient_id: str) -> List[Dict]:
    recordings = []
    patient_dir_name = None
    
    # Encontrar el directorio del paciente basado en su ID
    patient = get_patient(patient_id)
    if patient:
        patient_dir_name = patient["name"].lower().replace(" ", "_")
    else:
        # Buscar por ID si no se encuentra por nombre
        for dir_name in os.listdir("Pacientes"):
            if patient_id.lower() in dir_name.lower():
                patient_dir_name = dir_name
                break
    
    if not patient_dir_name:
        return []
    
    # Buscar grabaciones en el directorio del paciente
    patient_dir = os.path.join("Pacientes", patient_dir_name)
    if not os.path.exists(patient_dir):
        return []
    
    for file_name in os.listdir(patient_dir):
        if file_name.endswith('.webm') or file_name.endswith('.wav'):
            recording_path = os.path.join(patient_dir, file_name)
            
            # Buscar transcripción asociada
            transcription_path = None
            for trans_file in os.listdir(patient_dir):
                if trans_file.startswith("transcripcion_") and trans_file.endswith(".txt"):
                    if file_name.split("_")[0] in trans_file:
                        transcription_path = os.path.join(patient_dir, trans_file)
                        break
            
            # Intentar encontrar genograma asociado
            genogram_path = None
            for geno_file in os.listdir(patient_dir):
                if geno_file.startswith("genograma_") and geno_file.endswith(".json"):
                    if file_name.split("_")[0] in geno_file:
                        genogram_path = os.path.join(patient_dir, geno_file)
                        break
            
            recording_info = {
                "id": os.path.splitext(file_name)[0],
                "patient_id": patient_id,
                "file_path": recording_path,
                "file_name": file_name,
                "created_at": datetime.fromtimestamp(os.path.getctime(recording_path)),
                "transcription_path": transcription_path,
                "genogram_path": genogram_path
            }
            
            recordings.append(recording_info)
    
    # Ordenar por fecha, más reciente primero
    return sorted(recordings, key=lambda x: x.get("created_at", ""), reverse=True)

def get_transcription_content(transcription_path: str) -> Optional[str]:
    if not transcription_path or not os.path.exists(transcription_path):
        return None
        
    with open(transcription_path, "r", encoding="utf-8") as f:
        return f.read()