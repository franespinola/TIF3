from app.core.database import engine, SessionLocal
from sqlalchemy import text
import json

def verify_genogram_insertion():
    """Verifica que el paciente y el genograma se hayan insertado correctamente."""
    db = SessionLocal()
    try:
        # Verificar el paciente
        patient_result = db.execute(text("SELECT id, name FROM patients WHERE id = 'patient_xyz789'")).first()
        if patient_result:
            print(f"✅ Paciente encontrado: ID={patient_result[0]}, Nombre={patient_result[1]}")
        else:
            print("❌ No se encontró el paciente con ID 'patient_xyz789'.")
            
        # Verificar el genograma
        genogram_result = db.execute(text("SELECT id, patient_id, name FROM genograms WHERE id = 'genogram_12345abc'")).first()
        if genogram_result:
            print(f"✅ Genograma encontrado: ID={genogram_result[0]}, Paciente={genogram_result[1]}, Nombre={genogram_result[2]}")
            
            # Verificar la estructura del JSON
            data_result = db.execute(text("SELECT data FROM genograms WHERE id = 'genogram_12345abc'")).scalar()
            if data_result:
                data = json.loads(data_result)
                print(f"✅ Datos del genograma: {len(data.get('people', []))} personas, {len(data.get('relationships', []))} relaciones")
                
                # Mostrar algunas personas
                people = data.get('people', [])
                if people:
                    print("\nPersonas en el genograma:")
                    for i, person in enumerate(people[:3]):  # Mostrar solo las primeras 3
                        print(f"  {i+1}. {person.get('name')} ({person.get('role')})")
                    if len(people) > 3:
                        print(f"  ... y {len(people) - 3} más.")
            else:
                print("❌ No se encontraron datos JSON en el genograma.")
        else:
            print("❌ No se encontró el genograma con ID 'genogram_12345abc'.")
            
    except Exception as e:
        print(f"Error al verificar: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    verify_genogram_insertion()
