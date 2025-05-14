from app.core.database import engine, SessionLocal, Base
from app.models import Genogram, Patient
from datetime import datetime

# Datos del genograma
genogram_data = {
  "id": "genogram_12345abc",
  "patient_id": "patient_xyz789",
  "name": "Genograma Familia Pérez - Caso Inicial",
  "description": "Genograma inicial de la familia Pérez, centrado en el paciente Francisco. Se observan tres generaciones y algunas dinámicas clave.",
  "thumbnail": "https://example.com/thumbnails/genogram_12345abc.png",  "notes": "El paciente (Francisco) reporta una relación conflictiva con su padre (José) y una relación cercana con su hermana (Laura). La abuela paterna (Carmen) es una figura de apoyo. Abuelo paterno (Manuel) fallecido. No se reportan otros problemas significativos en la primera entrevista.",
  "created_at": "2023-10-26T10:00:00Z",
  "updated_at": "2023-10-26T11:30:00Z",
  "data": {
    "people": [
      {
        "id": "p1_francisco",
        "name": "Francisco Pérez",
        "gender": "M",
        "generation": 3,
        "birthDate": "1990-05-15",
        "age": 33,
        "deathDate": None,
        "role": "paciente",
        "notes": "Presenta síntomas de ansiedad.",
        "displayGroup": None,
        "attributes": {
          "isPatient": True,
          "isDeceased": False,
          "isPregnancy": False,
          "isAbortion": False,
          "isAdopted": False,
          "abortionType": None,
          "gestationalAge": None
        }
      },
      {
        "id": "p2_silvia",
        "name": "Silvia Gómez",
        "gender": "F",
        "generation": 2,
        "birthDate": "1965-03-10",
        "age": 58,
        "deathDate": None,
        "role": "madre",
        "notes": "Relación estable con el paciente.",
        "displayGroup": "pareja_padres_paciente",
        "attributes": {
          "isPatient": False,
          "isDeceased": False,
          "isPregnancy": False,
          "isAbortion": False,
          "isAdopted": False,
          "abortionType": None,
          "gestationalAge": None
        }
      },
      {
        "id": "p3_jose",
        "name": "José Pérez",
        "gender": "M",
        "generation": 2,
        "birthDate": "1963-07-20",
        "age": 60,
        "deathDate": None,
        "role": "padre",
        "notes": "Referido por el paciente como 'distante y crítico'.",
        "displayGroup": "pareja_padres_paciente",
        "attributes": {
          "isPatient": False,
          "isDeceased": False,
          "isPregnancy": False,
          "isAbortion": False,
          "isAdopted": False,
          "abortionType": None,
          "gestationalAge": None
        }
      },
      {
        "id": "p4_manuel",
        "name": "Manuel Pérez",
        "gender": "M",
        "generation": 1,
        "birthDate": "1935-01-01",
        "age": None,
        "deathDate": "2010-11-15",
        "role": "abuelo paterno",
        "notes": "Falleció de un infarto.",
        "displayGroup": "pareja_abuelos_paternos",
        "attributes": {
          "isPatient": False,
          "isDeceased": True,
          "isPregnancy": False,
          "isAbortion": False,
          "isAdopted": False,
          "abortionType": None,
          "gestationalAge": None
        }
      },
      {
        "id": "p5_carmen",
        "name": "Carmen Rodríguez",
        "gender": "F",
        "generation": 1,
        "birthDate": "1938-06-05",
        "age": 85,
        "deathDate": None,
        "role": "abuela paterna",
        "notes": "Vive sola, buena salud general. Figura de apoyo para Francisco.",
        "displayGroup": "pareja_abuelos_paternos",
        "attributes": {
          "isPatient": False,
          "isDeceased": False,
          "isPregnancy": False,
          "isAbortion": False,
          "isAdopted": False,
          "abortionType": None,
          "gestationalAge": None
        }
      },
      {
        "id": "p6_laura",
        "name": "Laura Pérez",
        "gender": "F",
        "generation": 3,
        "birthDate": "1993-12-01",
        "age": 29,
        "deathDate": None,
        "role": "hermana",
        "notes": "Relación muy cercana con Francisco.",
        "displayGroup": None,
        "attributes": {
          "isPatient": False,
          "isDeceased": False,
          "isPregnancy": False,
          "isAbortion": False,
          "isAdopted": False,
          "abortionType": None,
          "gestationalAge": None
        }
      }
    ],
    "relationships": [
      {
        "id": "r1_jose_silvia",
        "source": "p3_jose",
        "target": "p2_silvia",
        "type": "conyugal",
        "legalStatus": "matrimonio",
        "emotionalBond": None,
        "startDate": "1988-02-14",
        "endDate": None,
        "notes": "Matrimonio de 35 años."
      },
      {
        "id": "r2_manuel_carmen",
        "source": "p4_manuel",
        "target": "p5_carmen",
        "type": "conyugal",
        "legalStatus": "matrimonio",
        "emotionalBond": None,
        "startDate": "1960-07-30",
        "endDate": "2010-11-15",
        "notes": "Relación finalizada por fallecimiento de Manuel."
      },
      {
        "id": "r3_jose_francisco",
        "source": "p3_jose",
        "target": "p1_francisco",
        "type": "parentChild",
        "legalStatus": None,
        "emotionalBond": "conflicto",
        "startDate": None,
        "endDate": None,
        "notes": "El paciente describe la relación como tensa y con poca comunicación."
      },
      {
        "id": "r4_silvia_francisco",
        "source": "p2_silvia",
        "target": "p1_francisco",
        "type": "parentChild",
        "legalStatus": None,
        "emotionalBond": "cercano",
        "startDate": None,
        "endDate": None,
        "notes": "La madre es un apoyo para el paciente."
      },
      {
        "id": "r5_jose_laura",
        "source": "p3_jose",
        "target": "p6_laura",
        "type": "parentChild",
        "legalStatus": None,
        "emotionalBond": None,
        "startDate": None,
        "endDate": None,
        "notes": ""
      },
      {
        "id": "r6_silvia_laura",
        "source": "p2_silvia",
        "target": "p6_laura",
        "type": "parentChild",
        "legalStatus": None,
        "emotionalBond": "cercano",
        "startDate": None,
        "endDate": None,
        "notes": ""
      },
      {
        "id": "r7_francisco_laura",
        "source": "p1_francisco",
        "target": "p6_laura",
        "type": "hermanos",
        "legalStatus": None,
        "emotionalBond": "cercano",
        "startDate": None,
        "endDate": None,
        "notes": "Se apoyan mutuamente, confidentes."
      },
      {
        "id": "r8_manuel_jose",
        "source": "p4_manuel",
        "target": "p3_jose",
        "type": "parentChild",
        "legalStatus": None,
        "emotionalBond": None,
        "startDate": None,
        "endDate": None,
        "notes": ""
      },
      {
        "id": "r9_carmen_jose",
        "source": "p5_carmen",
        "target": "p3_jose",
        "type": "parentChild",
        "legalStatus": None,
        "emotionalBond": None,
        "startDate": None,
        "endDate": None,
        "notes": ""
      }
    ]
  }
}

def insert_genogram_with_sqlalchemy():
    print("Insertando genograma con SQLAlchemy...")
    
    # Crear una sesión
    db = SessionLocal()
    
    try:
        # Primero, verificar si el genograma ya existe
        existing_genogram = db.query(Genogram).filter(Genogram.id == genogram_data["id"]).first()
        
        if existing_genogram:
            print(f"Ya existe un genograma con el ID: {genogram_data['id']}")
            
            # Preguntar si desea actualizarlo
            response = input("¿Desea actualizarlo? (s/n): ")
            if response.lower() != 's':
                print("Operación cancelada.")
                return
            
            # Actualizar el genograma existente
            existing_genogram.patient_id = genogram_data["patient_id"]
            existing_genogram.name = genogram_data["name"]
            existing_genogram.description = genogram_data["description"]
            existing_genogram.thumbnail = genogram_data["thumbnail"]
            existing_genogram.data = genogram_data["data"]
            existing_genogram.notes = genogram_data["notes"]
            # Las fechas se mantienen como están o se pueden actualizar si es necesario
            existing_genogram.updated_at = datetime.utcnow()
            
            print(f"Genograma actualizado con ID: {genogram_data['id']}")
        else:
            # Verificar si el paciente existe
            patient = db.query(Patient).filter(Patient.id == genogram_data["patient_id"]).first()
            if not patient:
                print(f"¡ALERTA! No se encontró un paciente con ID: {genogram_data['patient_id']}")
                
                # Preguntar si desea continuar
                response = input("¿Desea continuar sin un paciente válido? (s/n): ")
                if response.lower() != 's':
                    print("Operación cancelada.")
                    return
            
            # Crear un nuevo objeto Genogram
            new_genogram = Genogram(
                id=genogram_data["id"],
                patient_id=genogram_data["patient_id"],
                name=genogram_data["name"],
                description=genogram_data["description"],
                thumbnail=genogram_data["thumbnail"],
                data=genogram_data["data"],
                notes=genogram_data["notes"],
                # Si no se proporcionan fechas, usar la actual                created_at=datetime.fromisoformat(genogram_data.get("created_at", datetime.utcnow().isoformat()).replace("Z", "+00:00")),
                updated_at=datetime.fromisoformat(genogram_data.get("updated_at", datetime.utcnow().isoformat()).replace("Z", "+00:00"))
            )
            
            # Añadir a la sesión
            db.add(new_genogram)
            
            print(f"Nuevo genograma insertado con ID: {genogram_data['id']}")
        
        # Guardar los cambios
        db.commit()
        
    except Exception as e:
        db.rollback()
        print(f"Error: {e}")
        # Para debugging
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    insert_genogram_with_sqlalchemy()
