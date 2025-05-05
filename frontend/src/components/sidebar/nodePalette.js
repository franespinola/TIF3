const nodePalette = [
  {
    type: "paciente",
    label: "Paciente",
  },
  {
    type: "masculino",
    label: "Masculino",
  },
  {
    type: "femenino",
    label: "Femenino",
  },
  {
    type: "fallecidoM",
    label: "Fallecido M",
  },
  {
    type: "fallecidoF",
    label: "Fallecido F",
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
    data: { width: 100, height: 80, stroke: '#000000', fill: 'transparent', strokeWidth: 2 }
  },
  {
    type: "circle",
    label: "Círculo",
    isDrawing: true,
    data: { radius: 50, stroke: '#000000', fill: 'transparent', strokeWidth: 2 }
  },
  {
    type: "text",
    label: "Texto",
    isDrawing: true,
    data: { text: "Texto", fontSize: 16, color: '#000000', width: 150 }
  },
  {
    type: "note",
    label: "Nota",
    isDrawing: true,
    data: { text: "Nota", width: 150, height: 100, color: '#000000', fill: '#FFFF88', border: '#E6C000' }
  },
  
  // Nodos de diagrama de flujo
  {
    type: "diamond",
    label: "Rombo (Decisión)",
    isDrawing: true,
    category: "flowchart",
    data: { width: 100, height: 80, stroke: '#000000', fill: 'white', strokeWidth: 1 }
  },
  {
    type: "oval",
    label: "Óvalo (Inicio/Fin)",
    isDrawing: true,
    category: "flowchart",
    data: { width: 100, height: 50, stroke: '#000000', fill: 'white', strokeWidth: 1 }
  },
  {
    type: "roundedRect",
    label: "Rect. Redondeado",
    isDrawing: true,
    category: "flowchart",
    data: { width: 100, height: 60, stroke: '#000000', fill: 'white', strokeWidth: 1, cornerRadius: 10 }
  },
  {
    type: "comment",
    label: "Comentario",
    isDrawing: true,
    category: "flowchart",
    data: { width: 120, height: 70, stroke: '#000000', fill: 'white', strokeWidth: 1, text: "Comentario" }
  },
  {
    type: "hexagon",
    label: "Hexágono",
    isDrawing: true,
    category: "flowchart",
    data: { width: 120, height: 60, stroke: '#000000', fill: 'white', strokeWidth: 1 }
  },
  {
    type: "cylinder",
    label: "Base de Datos",
    isDrawing: true,
    category: "flowchart",
    data: { width: 100, height: 80, stroke: '#000000', fill: 'white', strokeWidth: 1 }
  },
  {
    type: "document",
    label: "Documento",
    isDrawing: true,
    category: "flowchart",
    data: { width: 100, height: 70, stroke: '#000000', fill: 'white', strokeWidth: 1 }
  },
  {
    type: "table",
    label: "Tabla",
    isDrawing: true,
    category: "flowchart",
    data: { width: 120, height: 80, stroke: '#000000', fill: 'white', strokeWidth: 1, rows: 2, columns: 3 }
  },
  {
    type: "triangle",
    label: "Triángulo",
    isDrawing: true,
    category: "flowchart",
    data: { width: 100, height: 80, stroke: '#000000', fill: 'white', strokeWidth: 1, orientation: 'down' }
  },
  {
    type: "arrow",
    label: "Flecha",
    isDrawing: true,
    category: "flowchart",
    data: { width: 120, height: 60, stroke: '#000000', fill: 'white', strokeWidth: 1, direction: 'right' }
  },
  {
    type: "bracket",
    label: "Llave",
    isDrawing: true,
    category: "flowchart",
    data: { width: 60, height: 100, stroke: '#000000', fill: 'transparent', strokeWidth: 2, type: 'curly', variant: 'opening' }
  },
  {
    type: "cross",
    label: "Cruz",
    isDrawing: true,
    category: "flowchart",
    data: { width: 60, height: 60, stroke: '#000000', fill: 'white', strokeWidth: 2 }
  },
  {
    type: "xNode",
    label: "X",
    isDrawing: true,
    category: "flowchart",
    data: { width: 60, height: 60, stroke: '#000000', fill: 'white', strokeWidth: 2 }
  },
  {
    type: "flag",
    label: "Bandera",
    isDrawing: true,
    category: "flowchart",
    data: { width: 120, height: 60, stroke: '#000000', fill: 'white', strokeWidth: 1 }
  }
];

export default nodePalette;
