import React, { useState, useEffect } from 'react';
import { Handle, Position } from 'reactflow';

const MasculinoNode = ({ data, id }) => {
    const [editing, setEditing] = useState(false);
    const [label, setLabel] = useState(data?.label || "");
    
    // Log para depuración
    useEffect(() => {
      console.log(`Nodo masculino ${id} data:`, data);
    }, [data, id]);
    
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

          {/* Mostrar edad dentro del nodo para hacerla más visible */}
          {data.age != null && (
            <div style={{ 
              position: 'absolute', 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)',
              fontSize: 12,
              fontWeight: 'bold',
              color: '#000'
            }}>
              {data.age}
            </div>
          )}
        </div>
        {editing ? (
          <>
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              onBlur={handleBlur}
              autoFocus
              style={{ textAlign: "center", fontSize: 10, marginTop: 4 }}
            />
            {data.age != null && (
              <div style={{ textAlign: "center", fontSize: 10, marginTop: 4, fontWeight: 'bold' }}>
                Edad: {data.age}
              </div>
            )}
          </>
        ) : (
          <div
            onDoubleClick={() => setEditing(true)}
            style={{ marginTop: 4, textAlign: "center", fontSize: 10 }}
          >
            <strong>ID: {id}</strong> <br />
            {label} <br />
            {data.age != null && (
              <div style={{ textAlign: "center", fontSize: 10, marginTop: 4, fontWeight: 'bold' }}>
                Edad: {data.age}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

export default MasculinoNode;