import React from "react";
import { getSmoothStepPath } from "reactflow";
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

  const [defaultSmooth, labelX, labelY] = getSmoothStepPath({
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
      strokeColor = "black";
      strokeWidth = 2;
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
      strokeColor = "black";
      pathProps.strokeDasharray = "6 3";
      edgePath = defaultSmooth;
      break;

    case "violencia":
      strokeColor = "#ff0000";
      strokeWidth = 2;
      edgePath = createRoundedWavePath(
        sourceX,
        sourceY,
        targetX,
        targetY,
        30,
        30
      );
      break;

    case "conflicto":
      strokeColor = "#800000";
      strokeWidth = 2;
      edgePath = createZigZagPath(sourceX, sourceY, targetX, targetY, 12, 10);
      break;

    case "cercana":
      const aquaColor = "#20c997";
      const [path1] = getSmoothStepPath({
        sourceX,
        sourceY: sourceY - 3,
        targetX,
        targetY: targetY - 3,
        sourcePosition,
        targetPosition,
      });
      const [path2] = getSmoothStepPath({
        sourceX,
        sourceY: sourceY + 3,
        targetX,
        targetY: targetY + 3,
        sourcePosition,
        targetPosition,
      });
      extraElements = (
        <>
          <path d={path1} stroke={aquaColor} strokeWidth="3" fill="none" />
          <path d={path2} stroke={aquaColor} strokeWidth="3" fill="none" />
        </>
      );
      edgePath = "";
      break;

    case "distante":
      strokeColor = "#ff0000";
      pathProps.strokeDasharray = "6 6";
      edgePath = defaultSmooth;
      break;

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
      break;
  }

  return (
    <g className="react-flow__edge">
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
      {extraElements}
    </g>
  );
}

export default RelationshipEdge;
