import React, { useEffect } from 'react';
import { getSmoothStepPath } from 'reactflow';
import { createRoundedWavePath, createZigZagPath } from "../../utils/pathUtils";

/**
 * Componente para representar una conexión padre-hijo desde el nodo familia
 * o directamente desde un padre (en el caso de familias monoparentales)
 */
const ChildEdge = ({ 
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
  markerEnd,
}) => {
  // Configurar estilo base según tipo de relación
  const relType = data?.relType || 'parentChild';
  
  // Log para depuración
  useEffect(() => {
    console.log(`ChildEdge ${id} actualizado con relType:`, relType, data);
  }, [id, relType, data]);
  
  // Estilos por defecto basados en el tipo de relación
  let edgeStyle = {
    strokeWidth: 2,
    stroke: '#555',
    ...style,
  };
  
  let extraElements = null;
  
  // Calcular path para la conexión usando smoothstep que es ideal para padre-hijo
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 10, // Radio de curvatura para las esquinas
  });
  
  // Calcular punto medio para elementos adicionales
  const midX = (sourceX + targetX) / 2;
  const midY = (sourceY + targetY) / 2;

  // Estilos específicos según tipo de relación
  switch (relType) {
    case 'parentChild':
      // Estilo por defecto para relación padre-hijo
      break;
      
    case 'divorcio':
      edgeStyle = {
        ...edgeStyle,
        strokeDasharray: '5,5',
        stroke: '#f44336',
      };
      extraElements = (
        <g key={`${id}-divorcio-${relType}`}>
          <line
            x1={midX + 5}
            y1={midY - 12}
            x2={midX - 5}
            y2={midY + 12}
            stroke="#f44336"
            strokeWidth={2}
          />
          <line
            x1={midX}
            y1={midY - 12}
            x2={midX - 10}
            y2={midY + 12}
            stroke="#f44336"
            strokeWidth={2}
          />
        </g>
      );
      break;
      
    case 'separacion':
      edgeStyle = {
        ...edgeStyle,
        strokeDasharray: '5,5',
        stroke: '#ff9800',
      };
      break;
      
    case 'cohabitacion':
      edgeStyle = {
        ...edgeStyle,
        strokeDasharray: '4 4',
      };
      extraElements = (
        <path
          key={`${id}-cohabitacion-${relType}`}
          d={`M ${midX - 8},${midY} L ${midX},${midY - 8} L ${midX + 8},${midY}
             L ${midX + 8},${midY + 8} L ${midX - 8},${midY + 8} Z`}
          fill="none"
          stroke="black"
          strokeWidth={2}
        />
      );
      break;
      
    case 'compromiso':
      edgeStyle = {
        ...edgeStyle,
        strokeDasharray: '6 3',
      };
      break;
      
    case 'violencia':
      // Ocultar la línea principal y mostrar solo la ondulada
      edgeStyle = {
        ...edgeStyle,
        stroke: 'transparent', // Hacemos la línea principal invisible
      };
      extraElements = (
        <path
          key={`${id}-violencia-${relType}`}
          d={createRoundedWavePath(sourceX, sourceY, targetX, targetY, 30, 30)}
          stroke="#ff0000"
          strokeWidth={2}
          fill="none"
        />
      );
      break;
      
    case 'conflicto':
      // Ocultar la línea principal y mostrar solo el zigzag
      edgeStyle = {
        ...edgeStyle,
        stroke: 'transparent', // Hacemos la línea principal invisible
      };
      extraElements = (
        <path
          key={`${id}-conflicto-${relType}`}
          d={createZigZagPath(sourceX, sourceY, targetX, targetY, 12, 10)}
          stroke="#800000"
          strokeWidth={2}
          fill="none"
        />
      );
      break;
      
    case 'cercana': {
      // Crear dos líneas paralelas en color turquesa (como en la imagen)
      const aquaColor = "#20c997";
      edgeStyle = {
        ...edgeStyle,
        stroke: 'transparent', // Hacemos la línea principal invisible
      };
      
      // Usar el mismo patrón de path que en el smoothstep pero con offset fijo
      const offset = 4; // Distancia entre las dos líneas paralelas
      
      // Crear paths paralelos al path principal (smoothstep)
      const [path1] = getSmoothStepPath({
        sourceX,
        sourceY: sourceY - offset,
        sourcePosition,
        targetX,
        targetY: targetY - offset,
        targetPosition,
        borderRadius: 10,
      });
      
      const [path2] = getSmoothStepPath({
        sourceX,
        sourceY: sourceY + offset,
        sourcePosition,
        targetX,
        targetY: targetY + offset,
        targetPosition,
        borderRadius: 10,
      });
      
      extraElements = (
        <g key={`${id}-cercana-${relType}`}>
          <path
            d={path1}
            stroke={aquaColor}
            strokeWidth={2}
            fill="none"
          />
          <path
            d={path2}
            stroke={aquaColor}
            strokeWidth={2}
            fill="none"
          />
        </g>
      );
      break;
    }
      
    case 'distante': {
      // Actualizar para usar color gris con línea punteada
      const grayColor = "#888888";
      edgeStyle = {
        ...edgeStyle,
        stroke: grayColor,
        strokeDasharray: '6 6',
      };
      break;
    }
      
    case 'rota':
      edgeStyle = {
        ...edgeStyle,
        stroke: "gray",
      };
      extraElements = (
        <g key={`${id}-rota-${relType}`}>
          <line
            x1={midX - 3}
            y1={midY - 8}
            x2={midX - 3}
            y2={midY + 8}
            stroke="gray"
            strokeWidth={3}
          />
          <line
            x1={midX + 3}
            y1={midY - 8}
            x2={midX + 3}
            y2={midY + 8}
            stroke="gray"
            strokeWidth={3}
          />
        </g>
      );
      break;
      
    default:
      console.log(`Tipo de relación no reconocido en ChildEdge: ${relType}`);
      break;
  }

  // Forzar re-renderizado incluyendo relType en key
  return (
    <g key={`${id}-container-${relType}`} data-rel-type={relType}>
      <path
        id={id}
        key={`${id}-path-${relType}`}
        style={edgeStyle}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      {extraElements}
    </g>
  );
};

export default ChildEdge;