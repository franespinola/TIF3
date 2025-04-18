import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';

const PacienteNode = ({ data, id, onEdit }) => {
    const [editing, setEditing] = useState(false);
    const [label, setLabel] = useState(data?.label || "");
    
    // Determinar si los handles son conectables
    const isConnectable = data?.isConnectable !== false;
  
    const handleBlur = () => {
      setEditing(false);
      if (onEdit) {
        onEdit(id, label);
      }
    };
  
    return (
      <div
        style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        {/* La forma del nodo */}
        <div
          style={{
            width: 80,
            height: 80,
            background: "#e0f7fa",
            borderRadius: 10,
            border: "1px solid #0288d1",
            position: "relative",
          }}
        >
          {/* Handles con IDs específicos */}
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
  
        {/* Label debajo */}
        {editing ? (
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onBlur={handleBlur}
            autoFocus
            style={{ textAlign: "center", marginTop: 4 }}
          />
        ) : (
          <div
            onDoubleClick={() => setEditing(true)}
            style={{ marginTop: 4, textAlign: "center" }}
          >
            <strong>ID: {id}</strong> <br />
            {label}
          </div>
        )}
      </div>
    );
  };

export default PacienteNode;