import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';

const FallecidoMNode = ({ data, id }) => {
    const [editing, setEditing] = useState(false);
    const [label, setLabel] = useState(data?.label || "");
  
    const handleBlur = () => {
      setEditing(false);
      if (data?.onEdit) {
        data.onEdit(id, label);
      }
    };
  
    return (
      <div
        style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <div
          style={{
            width: 60,
            height: 60,
            background: "#fee2e2",
            border: "2px solid #7f1d1d",
            position: "relative",
          }}
        >
          <Handle
            type="target"
            position={Position.Top}
            style={{ background: "#555" }}
          />
          <Handle
            type="source"
            position={Position.Bottom}
            style={{ background: "#555" }}
          />
          <Handle
            type="target"
            position={Position.Left}
            style={{ background: "#555" }}
          />
          <Handle
            type="source"
            position={Position.Right}
            style={{ background: "#555" }}
          />
  
          {/* Cruz que cruce completamente el cuadrado */}
          <svg
            width="60"
            height="60"
            viewBox="0 0 60 60"
            style={{ position: "absolute", top: 0, left: 0 }}
          >
            <line
              x1="0"
              y1="0"
              x2="60"
              y2="60"
              stroke="#7f1d1d"
              strokeWidth="2"
            />
            <line
              x1="60"
              y1="0"
              x2="0"
              y2="60"
              stroke="#7f1d1d"
              strokeWidth="2"
            />
          </svg>
        </div>
        {editing ? (
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onBlur={handleBlur}
            autoFocus
            style={{ textAlign: "center", fontSize: 10, marginTop: 4 }}
          />
        ) : (
          <div
            onDoubleClick={() => setEditing(true)}
            style={{ marginTop: 4, textAlign: "center", fontSize: 10 }}
          >
            <strong>ID: {id}</strong> <br />
            {label}
          </div>
        )}
      </div>
    );
  };

export default FallecidoMNode;