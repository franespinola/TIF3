import sqlite3
import os

# Ruta a la base de datos
DB_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data")
DB_PATH = os.path.join(DB_DIR, "database.db")

# Verificar si el archivo existe
if os.path.exists(DB_PATH):
    print(f"Conectando a la base de datos: {DB_PATH}")
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Eliminar la tabla temporal
    cursor.execute("DROP TABLE IF EXISTS _alembic_tmp_appointments")
    conn.commit()
    print("Tabla _alembic_tmp_appointments eliminada correctamente.")
    
    conn.close()
else:
    print(f"El archivo de base de datos no existe: {DB_PATH}") 