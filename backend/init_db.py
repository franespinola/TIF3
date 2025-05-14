from app.core.database import engine
from app.models import Base

def init_db():
    # Crear todas las tablas
    Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    print("Creando tablas de la base de datos...")
    init_db()
    print("¡Base de datos inicializada!") 