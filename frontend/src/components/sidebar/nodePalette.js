// Lista de nodos disponibles para el genograma y otras herramientas de dibujo
const nodePalette = [
  // Nodos de genograma
  {
    type: "paciente",
    label: "Paciente",
    data: { size: 60 }
  },
  {
    type: "masculino",
    label: "Masculino",
    data: { size: 60 }
  },
  {
    type: "femenino",
    label: "Femenino",
    data: { size: 60 }
  },
  {
    type: "fallecidoM",
    label: "Fallecido",
    data: { size: 60, gender: "m" }
  },
  {
    type: "fallecidoF",
    label: "Fallecida",
    data: { size: 60, gender: "f" }
  },
  {
    type: "embarazo",
    label: "Embarazo",
  },
  {
    type: "abortoEspontaneo",
    label: "Aborto Espontáneo",
  },
  {
    type: "abortoProvocado",
    label: "Aborto Provocado",
  },
  {
    type: "fetoMuerto",
    label: "Feto Muerto",
  },
  {
    type: "fetoMuertoMujer",
    label: "Feto Muerto Mujer",
  },
  {
    type: "adopcion",
    label: "Adopción",
  },
  {
    type: "familyNode",
    label: "Nodo Familiar",
    data: { size: 32, color: "#2563eb", secondaryColor: "#f8fafc" }
  },
  // Herramientas de anotación
  {
    type: "rectangle",
    label: "Rectángulo",
    isDrawing: true, // Marcar como herramienta de dibujo
    data: { 
      width: 100, 
      height: 80, 
      stroke: 'rgb(59, 130, 246)', 
      fill: 'white', 
      strokeWidth: 2,
      textColor: '#000000',
      fontSize: 14
    }
  },
  {
    type: "circle",
    label: "Círculo",
    isDrawing: true,
    data: { 
      radius: 50, 
      stroke: 'rgb(59, 130, 246)', 
      fill: 'white', 
      strokeWidth: 2,
      textColor: '#000000',
      fontSize: 14
    }
  },
  {
    type: "text",
    label: "Texto",
    isDrawing: true,
    data: { 
      text: "Texto", 
      fontSize: 16, 
      color: '#000000', 
      width: 150,
      textColor: '#000000'
    }
  },
  {
    type: "note",
    label: "Nota",
    isDrawing: true,
    data: { 
      text: "Nota", 
      width: 150, 
      height: 100, 
      color: '#000000', 
      textColor: '#000000',
      fill: '#FFFF88', 
      border: '#E6C000', 
      fontSize: 14
    }
  },
  
  // Nodos de diagrama de flujo
  {
    type: "diamond",
    label: "Rombo (Decisión)",
    isDrawing: true,
    category: "flowchart",
    data: { 
      width: 100, 
      height: 80, 
      stroke: 'rgb(59, 130, 246)', 
      fill: 'white', 
      strokeWidth: 1.5,
      textColor: '#000000',
      fontSize: 14
    }
  },
  {
    type: "oval",
    label: "Óvalo (Inicio/Fin)",
    isDrawing: true,
    category: "flowchart",
    data: { 
      width: 100, 
      height: 50, 
      stroke: 'rgb(59, 130, 246)', 
      fill: 'white', 
      strokeWidth: 1.5,
      textColor: '#000000',
      fontSize: 14
    }
  },
  {
    type: "comment",
    label: "Comentario",
    isDrawing: true,
    category: "flowchart",
    data: { 
      width: 120, 
      height: 80, 
      stroke: 'rgb(59, 130, 246)', 
      fill: 'white', 
      strokeWidth: 1.5,
      textColor: '#000000',
      fontSize: 14
    }
  },
  {
    type: "hexagon",
    label: "Hexágono",
    isDrawing: true,
    category: "flowchart",
    data: { 
      width: 120, 
      height: 80, 
      stroke: 'rgb(59, 130, 246)', 
      fill: 'white', 
      strokeWidth: 1.5,
      textColor: '#000000',
      fontSize: 14
    }
  },
  {
    type: "cylinder",
    label: "Base de Datos",
    isDrawing: true,
    category: "flowchart",
    data: { 
      width: 100, 
      height: 80, 
      stroke: 'rgb(59, 130, 246)', 
      fill: 'white', 
      strokeWidth: 1.5,
      textColor: '#000000',
      fontSize: 14
    }
  },
  {
    type: "document",
    label: "Documento",
    isDrawing: true,
    category: "flowchart",
    data: { 
      width: 100, 
      height: 70, 
      stroke: 'rgb(59, 130, 246)', 
      fill: 'white', 
      strokeWidth: 1.5,
      textColor: '#000000',
      fontSize: 14
    }
  },
  {
    type: "table",
    label: "Tabla",
    isDrawing: true,
    category: "flowchart",
    data: { 
      width: 120, 
      height: 80, 
      stroke: 'rgb(59, 130, 246)', 
      fill: 'white', 
      strokeWidth: 1.5, 
      rows: 2, 
      columns: 3,
      textColor: '#000000',
      fontSize: 14
    }
  },
  {
    type: "triangle",
    label: "Triángulo",
    isDrawing: true,
    category: "flowchart",
    data: { 
      width: 100, 
      height: 80, 
      stroke: 'rgb(59, 130, 246)', 
      fill: 'white', 
      strokeWidth: 1.5,
      textColor: '#000000',
      fontSize: 14
    }
  },
  {
    type: "cross",
    label: "Cruz",
    isDrawing: true,
    category: "flowchart",
    data: { 
      width: 80, 
      height: 80, 
      stroke: 'rgb(59, 130, 246)', 
      fill: 'white', 
      strokeWidth: 1.5,
      textColor: '#000000',
      fontSize: 14
    }
  },
  {
    type: "xNode",
    label: "X",
    isDrawing: true,
    category: "flowchart",
    data: { 
      width: 80, 
      height: 80, 
      stroke: 'rgb(59, 130, 246)', 
      fill: 'white', 
      strokeWidth: 1.5,
      textColor: '#000000',
      fontSize: 14
    }
  },
  {
    type: "arrow",
    label: "Flecha",
    isDrawing: true,
    category: "flowchart",
    data: { 
      width: 100, 
      height: 60, 
      stroke: 'rgb(59, 130, 246)', 
      fill: 'white', 
      strokeWidth: 1.5,
      textColor: '#000000',
      fontSize: 14
    }
  },
  {
    type: "flag",
    label: "Bandera",
    isDrawing: true,
    category: "flowchart",
    data: { 
      width: 80, 
      height: 100, 
      stroke: 'rgb(59, 130, 246)', 
      fill: 'white', 
      strokeWidth: 1.5,
      textColor: '#000000',
      fontSize: 14
    }
  },
  {
    type: "roundedRect",
    label: "Rectángulo Redondeado",
    isDrawing: true,
    category: "flowchart",
    data: { 
      width: 120, 
      height: 60, 
      stroke: 'rgb(59, 130, 246)', 
      fill: 'white', 
      strokeWidth: 1.5, 
      cornerRadius: 10,
      textColor: '#000000',
      fontSize: 14
    }
  },
  {
    type: "bracket",
    label: "Llaves",
    isDrawing: true,
    category: "flowchart",
    data: { 
      width: 60, 
      height: 100, 
      stroke: 'rgb(59, 130, 246)', 
      fill: 'transparent', 
      strokeWidth: 1.5, 
      type: 'curly',
      textColor: '#000000',
      fontSize: 14
    }
  },
];

export default nodePalette;
