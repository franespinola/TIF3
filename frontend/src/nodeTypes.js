import PacienteNode from "./components/nodes/genogram/PacienteNode";
import MasculinoNode from "./components/nodes/genogram/MasculinoNode";
import FemeninoNode from "./components/nodes/genogram/FemeninoNode";
import FallecidoMNode from "./components/nodes/genogram/FallecidoMNode";
import FallecidoFNode from "./components/nodes/genogram/FallecidoFNode";
import EmbarazoNode from "./components/nodes/genogram/EmbarazoNode";
import AbortoEspontaneoNode from "./components/nodes/genogram/AbortoEspontaneoNode";
import AbortoProvocadoNode from "./components/nodes/genogram/AbortoProvocadoNode";
import FetoMuertoNode, { FetoMuertoMujer } from "./components/nodes/genogram/FetoMuertoNode";
import AdopcionNode from "./components/nodes/genogram/AdopcionNode";
import FamilyNode from "./components/nodes/genogram/FamilyNode";

// Importar componentes de anotación (ahora en la carpeta flowchart)
import RectangleNode from "./components/nodes/flowchart/RectangleNode";
import CircleNode from "./components/nodes/flowchart/CircleNode";
import TextNode from "./components/nodes/flowchart/TextNode";
import NoteNode from "./components/nodes/flowchart/NoteNode";

// Importar componentes de diagrama de flujo
import DiamondNode from "./components/nodes/flowchart/DiamondNode";
import OvalNode from "./components/nodes/flowchart/OvalNode";
import CommentNode from "./components/nodes/flowchart/CommentNode";
import HexagonNode from "./components/nodes/flowchart/HexagonNode";
import CylinderNode from "./components/nodes/flowchart/CylinderNode";
import DocumentNode from "./components/nodes/flowchart/DocumentNode";
import RoundedRectNode from "./components/nodes/flowchart/RoundedRectNode";
import BracketNode from "./components/nodes/flowchart/BracketNode";
import TableNode from "./components/nodes/flowchart/TableNode";
import TriangleNode from "./components/nodes/flowchart/TriangleNode";
import CrossNode from "./components/nodes/flowchart/CrossNode";
import XNode from "./components/nodes/flowchart/XNode";
import ArrowNode from "./components/nodes/flowchart/ArrowNode";
import FlagNode from "./components/nodes/flowchart/FlagNode";

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
  
  // Nodos de diagrama de flujo
  diamond: DiamondNode,       // Rombo para decisiones
  oval: OvalNode,             // Óvalo/Elipse (inicio/fin)
  comment: CommentNode,       // Nube de comentario
  hexagon: HexagonNode,       // Hexágono
  cylinder: CylinderNode,     // Cilindro (base de datos)
  document: DocumentNode,     // Documento
  roundedRect: RoundedRectNode, // Rectángulo con bordes redondeados
  bracket: BracketNode,       // Llaves y paréntesis
  table: TableNode,           // Tabla/Grid
  triangle: TriangleNode,     // Triángulo
  cross: CrossNode,           // Cruz/Plus
  xNode: XNode,               // Multiplicación/X
  arrow: ArrowNode,           // Flecha direccional
  flag: FlagNode,             // Bandera
};

export default nodeTypes;
