import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';

const AbortoNode = ({ data, id }) => {
    const [editing, setEditing] = useState(false);
    const [label, setLabel] = useState(data?.label || "✖");
    
    // Determinar si los handles son conectables
    const isConnectable = data?.isConnectable !== false;
  
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
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "#fcd34d",
            border: "2px solid #b45309",
            position: "relative",
          }}
        >
          <Handle
            type="target"
            position={Position.Top}
            id="t"
            style={{ background: "#555" }}
            isConnectable={isConnectable}
          />
          <Handle
            type="source"
            position={Position.Bottom}
            id="b"
            style={{ background: "#555" }}
            isConnectable={isConnectable}
          />
          <Handle
            type="target"
            position={Position.Left}
            id="l"
            style={{ background: "#555", top: '50%', transform: 'translateY(-50%)' }}
            isConnectable={isConnectable}
          />
          <Handle
            type="source"
            position={Position.Right}
            id="r"
            style={{ background: "#555", top: '50%', transform: 'translateY(-50%)' }}
            isConnectable={isConnectable}
          />
        </div>
  
        {editing ? (
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onBlur={handleBlur}
            autoFocus
            style={{ textAlign: "center", fontSize: 10, marginTop: 4, width: 40 }}
          />
        ) : (
          <div
            onDoubleClick={() => setEditing(true)}
            style={{ marginTop: 4, textAlign: "center", fontSize: 10, width: 50 }}
          >
            <strong>ID: {id}</strong> <br />
            {label}
          </div>
        )}
      </div>
    );
  };
  
export default AbortoNode;