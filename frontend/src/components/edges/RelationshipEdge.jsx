import React, { useEffect } from "react";
import { getSmoothStepPath, getBezierPath, getStraightPath } from "reactflow";
import { createRoundedWavePath, createZigZagPath } from "../../utils/pathUtils";

/**
 * Componente universal para todos los tipos de bordes en el genograma
 * Soporta relaciones conyugales, padre-hijo, hermanos/mellizos y anotaciones.
 * Ahora con soporte para estilos personalizados desde el selector de estilo de línea.
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
    markerEnd: defaultMarkerEnd,
  } = props;

  const { 
    relType = "matrimonio", 
    edgeType,
    originalType,
    emotionalBond,
    // Nuevas propiedades de estilo personalizadas
    strokeType = "solid", 
    connectionType = "bezier", 
    markerEnd = "none", 
    markerStart = "none", 
    strokeWidth: customStrokeWidth, 
  } = data;

  // Log para diagnóstico - muestra información detallada sobre cada relación
  useEffect(() => {
    console.log(`RelationshipEdge ${id} renderizado:`, { 
      relType, 
      edgeType,
      originalType,
      emotionalBond,
      data
    });
  }, [id, relType, edgeType, originalType, emotionalBond, data]);

  let edgePath = "";
  let strokeColor = "#555";
  let strokeWidth = customStrokeWidth || 2;
  let pathProps = { fill: "none" };
  let extraElements = null;
  let finalMarkerEnd = defaultMarkerEnd;
  let finalMarkerStart = "";
  
  // Determinar qué tipo de path generar según el tipo de conexión seleccionado
  let pathGenerator;
  switch (connectionType) {
    case "straight":
      pathGenerator = getStraightPath;
      break;
    case "step":
      pathGenerator = getSmoothStepPath;
      break;
    case "bezier":
    default:
      pathGenerator = getBezierPath;
      break;
  }

  // Sobreescribir el tipo de conexión si es una relación específica que requiere un estilo fijo
  if (edgeType === 'childEdge' || relType === 'parentChild') {
    // Para relaciones padre-hijo, mantenemos smoothStep a menos que se elija específicamente otra cosa
    if (!data.connectionType) {
      pathGenerator = getSmoothStepPath;
    }
  } 
  
  // Configuración para anotaciones
  if (edgeType === 'annotationEdge') {
    const { stroke = "#555", strokeWidth = 1.5, animated = false, dashArray = "5,5" } = data;
    strokeColor = stroke;
    pathProps.strokeWidth = strokeWidth;
    pathProps.strokeDasharray = dashArray;
    if (animated) {
      pathProps.className = "animated";
    }
  }

  // Configurar marcadores de inicio y fin
  if (markerStart !== "none") {
    switch (markerStart) {
      case "arrow":
        finalMarkerStart = "url(#edge-arrow-start)";
        break;
      case "circle":
        finalMarkerStart = "url(#edge-circle-start)";
        break;
      default:
        console.log(`Tipo de marcador de inicio no reconocido: ${markerStart}`);
        break;
    }
  }

  if (markerEnd !== "none") {
    switch (markerEnd) {
      case "arrow":
        finalMarkerEnd = "url(#edge-arrow-end)";
        break;
      case "circle":
        finalMarkerEnd = "url(#edge-circle-end)";
        break;
      default:
        console.log(`Tipo de marcador de fin no reconocido: ${markerEnd}`);
        break;
    }
  }

  // Configurar tipo de trazo
  switch (strokeType) {
    case "dashed":
      pathProps.strokeDasharray = "10 5";
      break;
    case "dotted":
      pathProps.strokeDasharray = "2 2";
      break;
    case "dashdot":
      pathProps.strokeDasharray = "10 5 2 5";
      break;
    case "doubleLines":
      // Se maneja en extraElements para líneas dobles
      break;
    default:
      // Tipo de trazo sólido por defecto (no requiere strokeDasharray)
      break;
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
  if (edgeType === 'partnerEdge' && !data.connectionType) {
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
      if (!pathProps.strokeDasharray) {
        pathProps.strokeDasharray = "5,5";
      }
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
      if (!pathProps.strokeDasharray) {
        pathProps.strokeDasharray = "4 4";
      }
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
      if (!pathProps.strokeDasharray) {
        pathProps.strokeDasharray = "6 3";
      }
      break;

    case "violencia":
      // Ocultar línea base y mostrar solo la ondulada
      edgePath = null;
      strokeColor = "#ff0000";
      extraElements = (
        <path
          d={createRoundedWavePath(sourceX, sourceY, targetX, targetY, 30, 30)}
          stroke="#ff0000"
          strokeWidth={strokeWidth}
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
          strokeWidth={strokeWidth}
          fill="none"
        />
      );
      break;

    case "cercana": {
      // Ocultar línea base y mostrar solo las dos líneas paralelas
      edgePath = null;
      const aquaColor = "#20c997";
      const offset = 4; // Distancia entre las líneas paralelas
      
      // Elegir entre paths rectos o curvos según el tipo de conexión
      let path1, path2;
      let pathGen = connectionType === "straight" ? getStraightPath : 
                    connectionType === "step" ? getSmoothStepPath : getBezierPath;
      
      if (edgeType === 'partnerEdge' && !data.connectionType) {
        // Para relaciones tipo partner sin tipo específico, usamos líneas rectas
        path1 = `M ${sourceX} ${sourceY - offset} L ${targetX} ${targetY - offset}`;
        path2 = `M ${sourceX} ${sourceY + offset} L ${targetX} ${targetY + offset}`;
      } else {
        [path1] = pathGen({
          sourceX, sourceY: sourceY - offset, sourcePosition,
          targetX, targetY: targetY - offset, targetPosition,
          borderRadius: 10,
        });
        [path2] = pathGen({
          sourceX, sourceY: sourceY + offset, sourcePosition,
          targetX, targetY: targetY + offset, targetPosition,
          borderRadius: 10,
        });
      }
      
      extraElements = (
        <>
          <path d={path1} stroke={aquaColor} strokeWidth={strokeWidth} fill="none" />
          <path d={path2} stroke={aquaColor} strokeWidth={strokeWidth} fill="none" />
        </>
      );
      break;
    }

    case "distante":{
      // Color gris con línea punteada
      strokeColor = "#888888";
      if (!pathProps.strokeDasharray) {
        pathProps.strokeDasharray = "6 6";
      }
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
      if (!pathProps.strokeDasharray) {
        pathProps.strokeDasharray = relType === "mellizos" ? "3 3" : "5 2";
      }
      break;

    default:
      // Estilo por defecto para otros tipos
      console.log(`Tipo de relación no reconocido: ${relType}`);
  }

  // Implementar líneas dobles si se seleccionó ese estilo
  if (strokeType === "doubleLines" && edgePath) {
    const offset = 3; // Distancia entre las dos líneas
    let path1, path2;
    
    // Usar el mismo tipo de generador de path que se usó para la ruta principal
    if (connectionType === "straight" || edgeType === 'partnerEdge') {
      // Para líneas rectas, calcular offset perpendicular
      const angle = Math.atan2(targetY - sourceY, targetX - sourceX) + Math.PI/2;
      const dx = offset * Math.cos(angle);
      const dy = offset * Math.sin(angle);
      
      path1 = `M ${sourceX + dx} ${sourceY + dy} L ${targetX + dx} ${targetY + dy}`;
      path2 = `M ${sourceX - dx} ${sourceY - dy} L ${targetX - dx} ${targetY - dy}`;
    } else {
      // Para curvas y steps, usar el offset en Y (simplificación)
      const pathGen = connectionType === "step" ? getSmoothStepPath : getBezierPath;
      
      [path1] = pathGen({
        sourceX, sourceY: sourceY - offset, sourcePosition,
        targetX, targetY: targetY - offset, targetPosition,
        borderRadius: 10,
      });
      [path2] = pathGen({
        sourceX, sourceY: sourceY + offset, sourcePosition,
        targetX, targetY: targetY + offset, targetPosition,
        borderRadius: 10,
      });
    }
    
    // Ocultar la línea principal y mostrar las dos líneas
    edgePath = null;
    extraElements = (
      <>
        <path 
          d={path1} 
          stroke={strokeColor} 
          strokeWidth={strokeWidth * 0.7} 
          fill="none" 
          markerEnd={finalMarkerEnd}
          markerStart={finalMarkerStart}
        />
        <path 
          d={path2} 
          stroke={strokeColor} 
          strokeWidth={strokeWidth * 0.7} 
          fill="none"
        />
        {extraElements}
      </>
    );
  }

  // Zona "hit" invisible para mejorar la selección
  const hitStrokeWidth = 15;
  const hitPath = defaultPath;

  return (
    <g className="react-flow__edge" data-rel-type={relType} data-edge-type={edgeType || "default"}>
      {/* Definiciones de marcadores */}
      <defs>
        <marker
          id="edge-arrow-end"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="8"
          markerHeight="8"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill={strokeColor} />
        </marker>
        <marker
          id="edge-arrow-start"
          viewBox="0 0 10 10"
          refX="2"
          refY="5"
          markerWidth="8"
          markerHeight="8"
          orient="auto"
        >
          <path d="M 10 0 L 0 5 L 10 10 z" fill={strokeColor} />
        </marker>
        <marker
          id="edge-circle-end"
          viewBox="0 0 10 10"
          refX="5"
          refY="5"
          markerWidth="8"
          markerHeight="8"
          orient="auto"
        >
          <circle cx="5" cy="5" r="4" fill="white" stroke={strokeColor} strokeWidth="1" />
        </marker>
        <marker
          id="edge-circle-start"
          viewBox="0 0 10 10"
          refX="5"
          refY="5"
          markerWidth="8"
          markerHeight="8"
          orient="auto"
        >
          <circle cx="5" cy="5" r="4" fill="white" stroke={strokeColor} strokeWidth="1" />
        </marker>
      </defs>

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
          markerEnd={finalMarkerEnd}
          markerStart={finalMarkerStart}
          {...pathProps}
        />
      )}
      
      {/* Elementos adicionales específicos de cada tipo de relación */}
      {extraElements}
    </g>
  );
}

export default RelationshipEdge;
