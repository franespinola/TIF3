import RelationshipEdge from "../src/components/edges/RelationshipEdge";

// Ahora todos los tipos de borde usan el mismo componente RelationshipEdge
// manteniendo los tipos diferentes para compatibilidad con código existente
const edgeTypes = {
  relationshipEdge: RelationshipEdge,
  annotationEdge: RelationshipEdge,
  partnerEdge: RelationshipEdge,
  childEdge: RelationshipEdge,
};

export default edgeTypes;
