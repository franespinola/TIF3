import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';

const MasculinoNode = ({ data, id }) => {
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
            background: "#ddd6fe",
            border: "2px solid #4f46e5",
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

export default MasculinoNode;