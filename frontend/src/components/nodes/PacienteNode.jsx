import React, { useState, useEffect } from 'react';
import { Handle, Position } from 'reactflow';

const PacienteNode = ({ data, id, onEdit }) => {
    const [editing, setEditing] = useState(false);
    const [label, setLabel] = useState(data?.label || "");
    
    // Log para depuración
    useEffect(() => {
      console.log(`Nodo paciente ${id} data:`, data);
    }, [data, id]);
    
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
          
          {/* Mostrar edad dentro del nodo */}
          {data.age != null && (
            <div style={{ 
              position: 'absolute', 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)',
              fontSize: 16,
              fontWeight: 'bold',
              color: '#000'
            }}>
              {data.age}
            </div>
          )}
        </div>
  
        {/* Label debajo */}
        {editing ? (
          <>
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onBlur={handleBlur}
            autoFocus
            style={{ textAlign: "center", marginTop: 4 }}
          />
          {data.age != null && (
            <div style={{ textAlign: "center", marginTop: 4, fontWeight: 'bold' }}>Edad: {data.age}</div>
          )}
          </>
        ) : (
          <div
            onDoubleClick={() => setEditing(true)}
            style={{ marginTop: 4, textAlign: "center" }}
          >
            <strong>ID: {id}</strong> <br />
            {label} <br />
            {data.age != null && (
              <div style={{ textAlign: "center", marginTop: 4, fontWeight: 'bold' }}>
                Edad: {data.age}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

export default PacienteNode;