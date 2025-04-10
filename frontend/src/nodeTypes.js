import PacienteNode from "./components/nodes/PacienteNode";
import MasculinoNode from "./components/nodes/MasculinoNode";
import FemeninoNode from "./components/nodes/FemeninoNode";
import FallecidoMNode from "./components/nodes/FallecidoMNode";
import FallecidoFNode from "./components/nodes/FallecidoFNode";
import EmbarazoNode from "./components/nodes/EmbarazoNode";
import AbortoNode from "./components/nodes/AbortoNode";
import AdopcionNode from "./components/nodes/AdopcionNode";

const nodeTypes = {
  paciente: PacienteNode,
  masculino: MasculinoNode,
  femenino: FemeninoNode,
  fallecidoM: FallecidoMNode,
  fallecidoF: FallecidoFNode,
  embarazo: EmbarazoNode,
  aborto: AbortoNode,
  adopcion: AdopcionNode,
};

export default nodeTypes;
