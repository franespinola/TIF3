import PacienteNode from "./components/nodes/PacienteNode";
import MasculinoNode from "./components/nodes/MasculinoNode";
import FemeninoNode from "./components/nodes/FemeninoNode";
import FallecidoMNode from "./components/nodes/FallecidoMNode";
import FallecidoFNode from "./components/nodes/FallecidoFNode";
import EmbarazoNode from "./components/nodes/EmbarazoNode";
import AbortoEspontaneoNode from "./components/nodes/AbortoEspontaneoNode";
import AbortoProvocadoNode from "./components/nodes/AbortoProvocadoNode";
import FetoMuertoNode, { FetoMuertoMujer } from "./components/nodes/FetoMuertoNode";
import AdopcionNode from "./components/nodes/AdopcionNode";
import RectangleNode from "./components/nodes/RectangleNode";
import CircleNode from "./components/nodes/CircleNode";
import TextNode from "./components/nodes/TextNode";
import NoteNode from "./components/nodes/NoteNode";
import FamilyNode from "./components/nodes/FamilyNode";

const nodeTypes = {
  // Nodos de genograma
  paciente: PacienteNode,
  masculino: MasculinoNode,
  femenino: FemeninoNode,
  fallecidoM: FallecidoMNode,
  fallecidoF: FallecidoFNode,
  embarazo: EmbarazoNode,
  abortoEspontaneo: AbortoEspontaneoNode,
  abortoProvocado: AbortoProvocadoNode,
  fetoMuerto: FetoMuertoNode,
  fetoMuertoMujer: FetoMuertoMujer,
  adopcion: AdopcionNode,
  familyNode: FamilyNode, // Nuevo nodo para estrategia nodo-familia
  
  // Nodos de anotación
  rectangle: RectangleNode,
  circle: CircleNode,
  text: TextNode,
  note: NoteNode,
};

export default nodeTypes;
