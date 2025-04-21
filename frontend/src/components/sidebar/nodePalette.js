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
  }
];

export default nodePalette;
