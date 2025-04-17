import PacienteNode from "./components/nodes/PacienteNode";
import MasculinoNode from "./components/nodes/MasculinoNode";
import FemeninoNode from "./components/nodes/FemeninoNode";
import FallecidoMNode from "./components/nodes/FallecidoMNode";
import FallecidoFNode from "./components/nodes/FallecidoFNode";
import EmbarazoNode from "./components/nodes/EmbarazoNode";
import AbortoNode from "./components/nodes/AbortoNode";
import AdopcionNode from "./components/nodes/AdopcionNode";
import RectangleNode from "./components/nodes/RectangleNode";
import CircleNode from "./components/nodes/CircleNode";
import TextNode from "./components/nodes/TextNode";
import NoteNode from "./components/nodes/NoteNode";

const nodeTypes = {
  // Nodos de genograma
  paciente: PacienteNode,
  masculino: MasculinoNode,
  femenino: FemeninoNode,
  fallecidoM: FallecidoMNode,
  fallecidoF: FallecidoFNode,
  embarazo: EmbarazoNode,
  aborto: AbortoNode,
  adopcion: AdopcionNode,
  
  // Nodos de anotación
  rectangle: RectangleNode,
  circle: CircleNode,
  text: TextNode,
  note: NoteNode,
};

export default nodeTypes;
