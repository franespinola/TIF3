import json
import os
from datetime import datetime
from app.core.database import SessionLocal
from app.models import Patient, Medication, ClinicalEntry, Genogram, Appointment

def load_json_data(file_path):
    if not os.path.exists(file_path):
        return {}
    with open(file_path, "r", encoding='utf-8') as f:
        return json.load(f)

def migrate_patients():
    db = SessionLocal()
    try:
        # Directorio de pacientes
        patients_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "data", "patients")
        
        # Migrar cada paciente
        for file_name in os.listdir(patients_dir):
            if file_name.endswith('.json'):
                file_path = os.path.join(patients_dir, file_name)
                patient_data = load_json_data(file_path)
                
                # Convertir fechas de string a datetime
                if isinstance(patient_data.get('first_visit'), str):
                    patient_data['first_visit'] = datetime.fromisoformat(patient_data['first_visit'])
                if isinstance(patient_data.get('last_visit'), str):
                    patient_data['last_visit'] = datetime.fromisoformat(patient_data['last_visit'])
                
                # Crear nuevo paciente en la base de datos
                db_patient = Patient(**patient_data)
                db.add(db_patient)
                
                # Migrar medicaciones
                for med_data in patient_data.get('medications', []):
                    if isinstance(med_data.get('start_date'), str):
                        med_data['start_date'] = datetime.fromisoformat(med_data['start_date'])
                    if isinstance(med_data.get('end_date'), str):
                        med_data['end_date'] = datetime.fromisoformat(med_data['end_date'])
                    
                    db_medication = Medication(**med_data)
                    db.add(db_medication)
        
        db.commit()
        print("Migración de pacientes completada")
    except Exception as e:
        db.rollback()
        print(f"Error en la migración de pacientes: {str(e)}")
    finally:
        db.close()

def migrate_genograms():
    db = SessionLocal()
    try:
        # Directorio de genogramas
        genograms_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "data", "genograms")
        
        # Migrar cada genograma
        for file_name in os.listdir(genograms_dir):
            if file_name.endswith('.json'):
                file_path = os.path.join(genograms_dir, file_name)
                genogram_data = load_json_data(file_path)
                
                # Convertir fechas
                if isinstance(genogram_data.get('created_at'), str):
                    genogram_data['created_at'] = datetime.fromisoformat(genogram_data['created_at'])
                if isinstance(genogram_data.get('last_modified'), str):
                    genogram_data['last_modified'] = datetime.fromisoformat(genogram_data['last_modified'])
                
                # Crear nuevo genograma en la base de datos
                db_genogram = Genogram(**genogram_data)
                db.add(db_genogram)
        
        db.commit()
        print("Migración de genogramas completada")
    except Exception as e:
        db.rollback()
        print(f"Error en la migración de genogramas: {str(e)}")
    finally:
        db.close()

def migrate_clinical_entries():
    db = SessionLocal()
    try:
        # Directorio de notas clínicas
        clinical_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "data", "clinical")
        
        # Migrar cada nota clínica
        for patient_dir in os.listdir(clinical_dir):
            patient_path = os.path.join(clinical_dir, patient_dir)
            if os.path.isdir(patient_path):
                for file_name in os.listdir(patient_path):
                    if file_name.endswith('.json'):
                        file_path = os.path.join(patient_path, file_name)
                        entry_data = load_json_data(file_path)
                        
                        # Convertir fechas
                        if isinstance(entry_data.get('date'), str):
                            entry_data['date'] = datetime.fromisoformat(entry_data['date'])
                        
                        # Crear nueva nota clínica en la base de datos
                        db_entry = ClinicalEntry(**entry_data)
                        db.add(db_entry)
        
        db.commit()
        print("Migración de notas clínicas completada")
    except Exception as e:
        db.rollback()
        print(f"Error en la migración de notas clínicas: {str(e)}")
    finally:
        db.close()

def migrate_appointments():
    db = SessionLocal()
    try:
        # Directorio de citas
        appointments_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "data", "appointments")
        
        # Migrar cada cita
        for file_name in os.listdir(appointments_dir):
            if file_name.endswith('.json'):
                file_path = os.path.join(appointments_dir, file_name)
                appointment_data = load_json_data(file_path)
                
                # Convertir fechas
                if isinstance(appointment_data.get('date_time'), str):
                    appointment_data['date_time'] = datetime.fromisoformat(appointment_data['date_time'])
                if isinstance(appointment_data.get('created_at'), str):
                    appointment_data['created_at'] = datetime.fromisoformat(appointment_data['created_at'])
                
                # Crear nueva cita en la base de datos
                db_appointment = Appointment(**appointment_data)
                db.add(db_appointment)
        
        db.commit()
        print("Migración de citas completada")
    except Exception as e:
        db.rollback()
        print(f"Error en la migración de citas: {str(e)}")
    finally:
        db.close()

if __name__ == "__main__":
    print("Iniciando migración de datos a SQLite...")
    migrate_patients()
    migrate_genograms()
    migrate_clinical_entries()
    migrate_appointments()
    print("Migración completada") 