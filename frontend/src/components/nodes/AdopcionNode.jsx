import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';

const AdopcionNode = ({ data, id }) => {
    const [editing, setEditing] = useState(false);
    const [label, setLabel] = useState(data?.label || "A");
  
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
            background: "#e0f2fe",
            border: "2px dotted #4b5563",
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
          <>
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              onBlur={handleBlur}
              autoFocus
              style={{ textAlign: "center", fontSize: 10, marginTop: 4, width: 40 }}
            />
            {data.age != null && (
              <div style={{ textAlign: "center", fontSize: 10, marginTop: 4 }}>
                Edad: {data.age}
              </div>
            )}
          </>
        ) : (
          <div
            onDoubleClick={() => setEditing(true)}
            style={{ marginTop: 4, textAlign: "center", fontSize: 10, width: 50 }}
          >
            <strong>ID: {id}</strong> <br />
            {label} <br />
            {data.age != null && <>Edad: {data.age}</>}
          </div>
        )}
      </div>
    );
  };

export default AdopcionNode;