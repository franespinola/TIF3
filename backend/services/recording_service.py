import os
from datetime import datetime

def save_recording(content: bytes, filename: str) -> str:
    """
    Guarda el contenido de audio en un directorio de grabaciones y devuelve la ruta del archivo.
    """
    # Directorio de grabaciones junto a la carpeta services
    base_dir = os.path.dirname(__file__)
    recordings_dir = os.path.abspath(os.path.join(base_dir, '../recordings'))
    os.makedirs(recordings_dir, exist_ok=True)

    timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S")
    safe_filename = f"{timestamp}_{filename}"
    filepath = os.path.join(recordings_dir, safe_filename)

    with open(filepath, 'wb') as f:
        f.write(content)

    return filepath