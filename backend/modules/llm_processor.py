import subprocess
import json

def extract_genogram_from_text(text: str) -> dict:
    prompt = f"""
A continuación se presenta una transcripción de una entrevista clínica.
Extraé la estructura familiar en formato JSON compatible con React Flow para un genograma.
Cada miembro debe tener:
- id único
- tipo de nodo: masculino, femenino, fallecidoM, fallecidoF, paciente, etc.
- data con: label (nombre) y generation (1=abuelos, 2=padres, 3=paciente, 4=hijos)
Cada relación debe tener:
- id único
- source y target (IDs de nodos)
- type: relationshipEdge
- data: relType (matrimonio, cercana, conflicto, etc.)

Texto:
{text}

Solo devolvé el JSON del genograma, sin explicaciones ni texto adicional.
"""

    try:
        result = subprocess.run(
            ["ollama", "run", "deepseek:14b"],
            input=prompt.encode("utf-8"),
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            timeout=180
        )

        output = result.stdout.decode("utf-8")

        # Buscar primer bloque JSON válido en la salida
        start_idx = output.find("{")
        end_idx = output.rfind("}") + 1
        json_str = output[start_idx:end_idx]

        return json.loads(json_str)

    except Exception as e:
        raise RuntimeError(f"Error al generar JSON con DeepSeek: {str(e)}")
