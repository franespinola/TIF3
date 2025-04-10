import dagre from "dagre";

export default function layoutWithDagre(nodes, edges) {
  const g = new dagre.graphlib.Graph();
  g.setGraph({
    rankdir: "TB", // top to bottom
    ranksep: 120,
    nodesep: 80,
  });
  g.setDefaultEdgeLabel(() => ({}));

  // 2. Agregar nodos
  nodes.forEach((node) => {
    const gen = node.data?.generation ?? 1;
    g.setNode(node.id, {
      width: 100,
      height: 100,
      rank: gen,
    });
  });

  // 3. Agregar edges
  edges.forEach((edge) => {
    g.setEdge(edge.source, edge.target);
  });

  // 4. layout
  dagre.layout(g);

  // 5. Actualizar posición
  return nodes.map((node) => {
    const nodeWithPosition = g.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - 50,
        y: nodeWithPosition.y - 50,
      },
    };
  });
}
