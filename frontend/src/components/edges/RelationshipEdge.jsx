import React from "react";
import { getSmoothStepPath, getBezierPath } from "reactflow";
import { createRoundedWavePath, createZigZagPath } from "../../utils/pathUtils";

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

  const relType = data.relType || "matrimonio";

  let edgePath = "";
  let strokeColor = "black";
  let strokeWidth = 2;
  let pathProps = { fill: "none" };
  let extraElements = null;

  // Ruta "smooth" y posición de etiqueta
  const [defaultSmooth, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  // Ruta Bézier (solo la ruta, sin los labels)
  const [bezierPath] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  const midX = labelX;
  const midY = labelY;

  switch (relType) {
    case "matrimonio":
      edgePath = defaultSmooth;
      break;

    case "bezier":
      edgePath = bezierPath;
      break;

    case "divorcio":
      edgePath = defaultSmooth;
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
      edgePath = defaultSmooth;
      extraElements = (
        <path
          d={`M ${midX - 8},${midY} L ${midX},${midY - 8} L ${midX + 8},${midY}
              L ${midX + 8},${midY + 8} L ${midX - 8},${midY + 8} Z`}
          fill="none"
          stroke="black"
          strokeWidth={2}
        />
      );
      break;

    case "compromiso":
      pathProps.strokeDasharray = "6 3";
      edgePath = defaultSmooth;
      break;

    case "violencia":
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
      const aquaColor = "#20c997";
      const offset = 8;
      const [path1] = getSmoothStepPath({
        sourceX,
        sourceY: sourceY - offset,
        targetX,
        targetY: targetY - offset,
        sourcePosition,
        targetPosition,
      });
      const [path2] = getSmoothStepPath({
        sourceX,
        sourceY: sourceY + offset,
        targetX,
        targetY: targetY + offset,
        sourcePosition,
        targetPosition,
      });
      extraElements = (
        <>
          <path d={path1} stroke={aquaColor} strokeWidth="3" fill="none" />
          <path d={path2} stroke={aquaColor} strokeWidth="3" fill="none" />
        </>
      );
      break;
    }

    case "distante":{
      const redColor = "#ff0000";
      const [distantePath] = getSmoothStepPath({
        sourceX,
        sourceY,
        targetX,
        targetY,
        sourcePosition,
        targetPosition,
      });
      extraElements = (
        <path
          d={distantePath}
          stroke={redColor}
          strokeWidth="2"
          fill="none"
          strokeDasharray="6 6"
        />
      );
      break;
    }

    case "rota":
      strokeColor = "gray";
      edgePath = defaultSmooth;
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

    default:
      edgePath = defaultSmooth;
  }

  // Zona "hit" invisible para mejorar la selección
  const hitStrokeWidth = 15;

  return (
    <g className="react-flow__edge">
      {edgePath && (
        <path
          id={`${id}-hit-area`}
          className="react-flow__edge-interaction"
          d={edgePath}
          stroke="transparent"
          strokeWidth={hitStrokeWidth}
          fill="none"
          style={{ cursor: 'pointer' }}
        />
      )}
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

      {/* Áreas de selección para relaciones especiales que no usan edgePath */}
      {!edgePath && extraElements && (
        <path
          d={relType === "violencia" 
              ? createRoundedWavePath(sourceX, sourceY, targetX, targetY, 30, 30)
              : relType === "conflicto" 
                ? createZigZagPath(sourceX, sourceY, targetX, targetY, 12, 10)
                : relType === "cercana" || relType === "distante"
                  ? defaultSmooth
                  : ""}
          stroke="transparent"
          strokeWidth={hitStrokeWidth}
          fill="none"
          style={{ cursor: 'pointer' }}
        />
      )}
    </g>
  );
}

export default RelationshipEdge;
