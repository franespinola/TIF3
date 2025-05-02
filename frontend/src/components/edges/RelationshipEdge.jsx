import React, { useEffect } from "react";
import { getSmoothStepPath, getBezierPath } from "reactflow";
import { createRoundedWavePath, createZigZagPath } from "../../utils/pathUtils";

/**
 * Componente universal para todos los tipos de bordes en el genograma
 * Soporta relaciones conyugales, padre-hijo, hermanos/mellizos y anotaciones.
 */
function RelationshipEdge(props) {
  const {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    data = {},
    markerEnd,
  } = props;

  const { relType = "matrimonio", edgeType } = data;

  // Log para depuración si es necesario
  useEffect(() => {
    console.log(`RelationshipEdge ${id} actualizado:`, { relType, edgeType, data });
  }, [id, relType, edgeType, data]);

  let edgePath = "";
  let strokeColor = "#555";
  let strokeWidth = 2;
  let pathProps = { fill: "none" };
  let extraElements = null;
  
  // Determinar qué tipo de path generar según el contexto de la relación
  let pathGenerator = getBezierPath;
  
  // Para relaciones padre-hijo usamos smoothStep si se indica específicamente
  if (edgeType === 'childEdge' || relType === 'parentChild') {
    pathGenerator = getSmoothStepPath;
  } 
  // Para anotaciones, ofrecemos la opción de estilo diferente
  else if (edgeType === 'annotationEdge') {
    const { stroke = "#555", strokeWidth = 1.5, animated = false, dashArray = "5,5" } = data;
    strokeColor = stroke;
    pathProps.strokeWidth = strokeWidth;
    pathProps.strokeDasharray = dashArray;
    if (animated) {
      pathProps.className = "animated";
    }
  }

  // Ruta y posición de etiqueta según el tipo de path
  const [defaultPath, labelX, labelY] = pathGenerator({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    borderRadius: 10, // Para smooth step paths
  });

  // Para ciertos tipos, siempre queremos una línea recta (como partnerEdge)
  if (edgeType === 'partnerEdge') {
    edgePath = `M ${sourceX} ${sourceY} L ${targetX} ${targetY}`;
  } else {
    edgePath = defaultPath;
  }

  // Usar el punto medio para posicionar elementos adicionales
  const midX = labelX || (sourceX + targetX) / 2;
  const midY = labelY || (sourceY + targetY) / 2;

  // Aplicar estilos según el tipo de relación
  switch (relType) {
    case "matrimonio":
    case "conyugal":
      // Estilo predeterminado para relaciones conyugales
      break;

    case "parentChild":
      // Estilo predeterminado para relaciones padre-hijo
      break;

    case "divorcio":
      pathProps.strokeDasharray = "5,5";
      strokeColor = "#f44336";
      extraElements = (
        <>
          <line
            x1={midX + 5}
            y1={midY - 12}
            x2={midX - 5}
            y2={midY + 12}
            stroke="black"
            strokeWidth={2}
          />
          <line
            x1={midX}
            y1={midY - 12}
            x2={midX - 10}
            y2={midY + 12}
            stroke="black"
            strokeWidth={2}
          />
        </>
      );
      break;

    case "cohabitacion":
      pathProps.strokeDasharray = "4 4";
      extraElements = (
        <path
          d={`M ${midX - 8},${midY} L ${midX},${midY - 8} L ${midX + 8},${midY}
              L ${midX + 8},${midY + 8} L ${midX - 8},${midY + 8} Z`}
          fill="none"
          stroke={strokeColor}
          strokeWidth={2}
        />
      );
      break;

    case "compromiso":
      pathProps.strokeDasharray = "6 3";
      break;

    case "violencia":
      // Ocultar línea base y mostrar solo la ondulada
      edgePath = null;
      strokeColor = "#ff0000";
      extraElements = (
        <path
          d={createRoundedWavePath(sourceX, sourceY, targetX, targetY, 30, 30)}
          stroke="#ff0000"
          strokeWidth={2}
          fill="none"
        />
      );
      break;

    case "conflicto":
      // Ocultar línea base y mostrar solo el zigzag
      edgePath = null;
      strokeColor = "#800000";
      extraElements = (
        <path
          d={createZigZagPath(sourceX, sourceY, targetX, targetY, 12, 10)}
          stroke="#800000"
          strokeWidth={2}
          fill="none"
        />
      );
      break;

    case "cercana": {
      // Ocultar línea base y mostrar solo las dos líneas paralelas
      edgePath = null;
      const aquaColor = "#20c997";
      const offset = 4; // Distancia entre las líneas paralelas
      
      // Elegir entre paths rectos o curvos según el contexto
      let path1, path2;
      
      if (edgeType === 'partnerEdge') {
        // Para relaciones tipo partner, usamos líneas rectas
        path1 = `M ${sourceX} ${sourceY - offset} L ${targetX} ${targetY - offset}`;
        path2 = `M ${sourceX} ${sourceY + offset} L ${targetX} ${targetY + offset}`;
      } else if (edgeType === 'childEdge' || relType === 'parentChild') {
        // Para relaciones padre-hijo, usamos smoothstep
        [path1] = getSmoothStepPath({
          sourceX, sourceY: sourceY - offset, sourcePosition,
          targetX, targetY: targetY - offset, targetPosition,
          borderRadius: 10,
        });
        [path2] = getSmoothStepPath({
          sourceX, sourceY: sourceY + offset, sourcePosition,
          targetX, targetY: targetY + offset, targetPosition,
          borderRadius: 10,
        });
      } else {
        // Para el resto, bezier
        [path1] = getBezierPath({
          sourceX, sourceY: sourceY - offset, sourcePosition,
          targetX, targetY: targetY - offset, targetPosition,
        });
        [path2] = getBezierPath({
          sourceX, sourceY: sourceY + offset, sourcePosition,
          targetX, targetY: targetY + offset, targetPosition,
        });
      }
      
      extraElements = (
        <>
          <path d={path1} stroke={aquaColor} strokeWidth="2" fill="none" />
          <path d={path2} stroke={aquaColor} strokeWidth="2" fill="none" />
        </>
      );
      break;
    }

    case "distante":{
      // Color gris con línea punteada
      strokeColor = "#888888";
      pathProps.strokeDasharray = "6 6";
      break;
    }

    case "rota":
      strokeColor = "gray";
      extraElements = (
        <>
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
        </>
      );
      break;

    case "hermanos":
    case "mellizos":
      // Estilo específico para relaciones entre hermanos
      pathProps.strokeDasharray = relType === "mellizos" ? "3 3" : "5 2";
      break;

    default:
      // Estilo por defecto para otros tipos
      console.log(`Tipo de relación no reconocido: ${relType}`);
  }

  // Zona "hit" invisible para mejorar la selección
  const hitStrokeWidth = 15;
  const hitPath = defaultPath;

  return (
    <g className="react-flow__edge" data-rel-type={relType} data-edge-type={edgeType || "default"}>
      {/* Área de interacción */}
      <path
        id={`${id}-hit-area`}
        className="react-flow__edge-interaction"
        d={hitPath}
        stroke="transparent"
        strokeWidth={hitStrokeWidth}
        fill="none"
        style={{ cursor: 'pointer' }}
      />
      
      {/* Línea principal (si aplica) */}
      {edgePath && (
        <path
          id={id}
          className="react-flow__edge-path"
          d={edgePath}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          markerEnd={markerEnd}
          {...pathProps}
        />
      )}
      
      {/* Elementos adicionales específicos de cada tipo de relación */}
      {extraElements}
    </g>
  );
}

export default RelationshipEdge;
