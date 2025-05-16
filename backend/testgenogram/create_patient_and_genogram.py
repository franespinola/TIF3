from app.core.database import engine, SessionLocal, Base
from app.models import Patient
import uuid
from datetime import datetime, timezone

# Datos del paciente asociado al genograma
patient_data = {
    "id": "patient_xyz789",
    "name": "Francisco Pérez",
    "age": 33,
    "gender": "Masculino",
    "email": "francisco.perez@example.com",
    "phone": "555-123-4567",
    "address": "Calle Ejemplo 123",
    "emergency_contact": "Laura Pérez (Hermana) - 555-765-4321",
    "diagnosis": "Ansiedad generalizada",
    "notes": "Paciente referido para evaluación de ansiedad y problemas familiares."
}

# Datos del genograma son los mismos que en el archivo insert_genogram_sqlalchemy.py

def ensure_patient_exists():
    """Verifica si el paciente existe, y si no, lo crea."""
    db = SessionLocal()
    try:
        # Buscar el paciente
        patient = db.query(Patient).filter(Patient.id == patient_data["id"]).first()
        
        if patient:
            print(f"El paciente con ID {patient_data['id']} ya existe en la base de datos.")
            return True
        else:
            print(f"El paciente con ID {patient_data['id']} no existe. Creándolo...")
            
            # Crear el paciente
            new_patient = Patient(
                id=patient_data["id"],
                name=patient_data["name"],
                age=patient_data["age"],
                gender=patient_data["gender"],
                email=patient_data["email"],
                phone=patient_data["phone"],
                address=patient_data["address"],
                emergency_contact=patient_data["emergency_contact"],
                diagnosis=patient_data["diagnosis"],
                notes=patient_data["notes"],
                first_visit=datetime.now(timezone.utc),
                created_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc)
            )
            
            db.add(new_patient)
            db.commit()
            print(f"Paciente creado con ID: {patient_data['id']}")
            return True
            
    except Exception as e:
        db.rollback()
        print(f"Error al crear el paciente: {e}")
        import traceback
        traceback.print_exc()
        return False
    finally:
        db.close()

if __name__ == "__main__":
    # Primero asegurarse de que el paciente existe
    if ensure_patient_exists():
        print("Ahora puede ejecutar el script insert_genogram_sqlalchemy.py para insertar el genograma.")
        
        # Opcionalmente, podemos ejecutar directamente el script de inserción
        import insert_genogram_sqlalchemy
        insert_genogram_sqlalchemy.insert_genogram_with_sqlalchemy()
    else:
        print("No se pudo asegurar la existencia del paciente. Abortando.")
