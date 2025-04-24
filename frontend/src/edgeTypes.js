import RelationshipEdge from "../src/components/edges/RelationshipEdge";
import AnnotationEdge from "../src/components/edges/AnnotationEdge";
import PartnerEdge from "../src/components/edges/PartnerEdge";
import ChildEdge from "../src/components/edges/ChildEdge";

const edgeTypes = {
  relationshipEdge: RelationshipEdge,
  annotationEdge: AnnotationEdge,
  partnerEdge: PartnerEdge,     // Nueva arista para conexión padre-nodo familia
  childEdge: ChildEdge,         // Nueva arista para conexión nodo familia-hijo
};

export default edgeTypes;
