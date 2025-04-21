import React, { useState } from 'react';
import BaseNodeComponent from './BaseNodeComponent';
import useCircleNode from '../../hooks/useCircleNode';
import useNodeEditor from '../../hooks/useNodeEditor';

const FemeninoNode = ({ data, id, selected }) => {
  // Estado para campos editables
  const [editingField, setEditingField] = useState(null);
  
  // Asegurarse de usar los valores desde data
  const name = data?.name || data?.label || 'Nombre';
  const age = data?.age !== undefined && data?.age !== null ? data.age : '';
  const profession = data?.profession || '';
  const info = data?.info || '';
  
  // Tamaño del nodo
  const defaultSize = data?.size || 60;
  
  // Usar el hook especializado para nodos circulares
  const [radius, size, resizeHandleRef, isResizing] = useCircleNode(
    id,
    { radius: defaultSize / 2 },
    defaultSize / 2,
    25 // min radius
  );
  
  // Determinar si los handles son conectables
  const isConnectable = data?.isConnectable !== false;
  
  // Manejadores para edición de campos
  const handleEdit = (field) => {
    setEditingField(field);
  };
  
  const handleSave = (field, value) => {
    setEditingField(null);
    if (data?.onEdit) {
      const updates = {};
      switch (field) {
        case 'name':
          updates.name = value;
          break;
        case 'age':
          updates.age = value;
          break;
        case 'profession':
          updates.profession = value;
          break;
        case 'info':
          updates.info = value;
          break;
      }
      data.onEdit(id, updates);
    }
  };
  
  const handleKeyDown = (e, field, value) => {
    if (e.key === 'Enter') {
      handleSave(field, value);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <BaseNodeComponent
        selected={selected}
        resizeHandleRef={resizeHandleRef}
        isConnectable={isConnectable}
        nodeStyles={{
          width: size.width,
          height: size.height,
          borderRadius: "50%",
          background: "#fecdd3",
          border: "2px solid #be185d",
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Mostrar edad dentro del nodo si está disponible */}
        {age !== '' && (
          <div style={{ 
            fontSize: Math.max(14, size.width * 0.2),
            fontWeight: 'bold',
            color: '#be185d',
          }}>
            {age}
          </div>
        )}
      </BaseNodeComponent>
      
      {/* Información del nodo debajo */}
      <div style={{ marginTop: 4, width: Math.max(120, size.width + 20) }}>
        {/* Nombre */}
        {editingField === 'name' ? (
          <input
            value={name}
            onChange={(e) => handleSave('name', e.target.value)}
            onBlur={() => handleSave('name', name)}
            onKeyDown={(e) => handleKeyDown(e, 'name', name)}
            autoFocus
            style={{ width: "100%", fontWeight: "bold", textAlign: "center" }}
          />
        ) : (
          <div 
            onDoubleClick={() => handleEdit('name')}
            style={{ fontWeight: "bold", textAlign: "center", cursor: "text" }}
          >
            {name}
          </div>
        )}
        
        {/* Edad */}
        {editingField === 'age' ? (
          <input
            value={age}
            onChange={(e) => handleSave('age', e.target.value)}
            onBlur={() => handleSave('age', age)}
            onKeyDown={(e) => handleKeyDown(e, 'age', age)}
            autoFocus
            style={{ width: "100%", textAlign: "center", fontSize: 12 }}
          />
        ) : (
          <div 
            onDoubleClick={() => handleEdit('age')}
            style={{ textAlign: "center", fontSize: 12, cursor: "text" }}
          >
            {age !== '' ? `Edad: ${age}` : "Edad: --"}
          </div>
        )}
        
        {/* Profesión */}
        {editingField === 'profession' ? (
          <input
            value={profession}
            onChange={(e) => handleSave('profession', e.target.value)}
            onBlur={() => handleSave('profession', profession)}
            onKeyDown={(e) => handleKeyDown(e, 'profession', profession)}
            autoFocus
            style={{ width: "100%", textAlign: "center", fontSize: 12 }}
          />
        ) : (
          <div 
            onDoubleClick={() => handleEdit('profession')}
            style={{ textAlign: "center", fontSize: 12, cursor: "text" }}
          >
            {profession || "Profesión: --"}
          </div>
        )}
        
        {/* Información adicional */}
        {editingField === 'info' ? (
          <textarea
            value={info}
            onChange={(e) => handleSave('info', e.target.value)}
            onBlur={() => handleSave('info', info)}
            autoFocus
            style={{ width: "100%", fontSize: 11, minHeight: 40 }}
          />
        ) : (
          <div 
            onDoubleClick={() => handleEdit('info')}
            style={{ fontSize: 11, marginTop: 2, cursor: "text" }}
          >
            {info ? info : "Información adicional..."}
          </div>
        )}
        
        {/* Identificador del nodo */}
        <div style={{ fontSize: 10, marginTop: 2, textAlign: "center" }}>
          ID: {id}
        </div>
      </div>
    </div>
  );
};

export default FemeninoNode;