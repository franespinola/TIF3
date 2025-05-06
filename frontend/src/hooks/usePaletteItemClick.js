import { useReactFlow } from 'reactflow';

/**
 * Hook personalizado para manejar el comportamiento de clic en elementos de paleta
 * Proporciona una implementación reutilizable para insertar nodos directamente al hacer clic
 */
export default function usePaletteItemClick(handleToolSelect) {
  // Obtener la instancia de ReactFlow para centrar nodos al hacer click
  const reactFlowInstance = useReactFlow();
  
  // Función para manejar el clic en un elemento de la paleta
  const handleItemClick = (item) => {
    // Primero marcamos la herramienta como activa
    if (handleToolSelect) {
      handleToolSelect(item.type);
    }
    
    // Luego insertamos el nodo en el centro de la vista actual
    const { x, y, zoom } = reactFlowInstance.getViewport();
    
    // Calcular el centro visible del viewport
    const centerX = x + (window.innerWidth / 2 - x) / zoom;
    const centerY = y + (window.innerHeight / 2 - y) / zoom;
    
    // Crear un nuevo nodo con ID único
    const newNodeId = `${item.type}_${Date.now()}`;
    const newNode = {
      id: newNodeId,
      type: item.type,
      position: { x: centerX, y: centerY },
      data: { 
        ...item.data,
        label: item.label,
        // Agregar una flag que indica que debe activar la edición
        initialEdit: true
      },
    };
    
    // Añadir el nodo al diagrama
    reactFlowInstance.addNodes(newNode);
    
    // Centrar la vista en el nuevo nodo con una animación suave
    reactFlowInstance.setCenter(centerX, centerY, { duration: 300 });
    
    // Seleccionar el nodo recién agregado y activar el modo de edición
    setTimeout(() => {
      // Seleccionamos el nodo
      reactFlowInstance.setNodes((nodes) =>
        nodes.map((node) =>
          node.id === newNodeId
            ? { ...node, selected: true }
            : { ...node, selected: false }
        )
      );
      
      // Emitimos un evento personalizado que será detectado para activar la edición
      const editEvent = new CustomEvent('activateNodeEdit', { detail: { nodeId: newNodeId } });
      document.dispatchEvent(editEvent);
    }, 100); // Un poco más de tiempo para que el nodo se renderice completamente
  };

  return handleItemClick;
}