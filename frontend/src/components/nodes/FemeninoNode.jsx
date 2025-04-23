import React, { useState } from 'react';
import BaseNodeComponent from './BaseNodeComponent';
import useNodeSize from '../../hooks/useNodeSize';

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
  
  // Usar el hook para gestionar el tamaño
  const [size, resizeHandleRef, isResizing] = useNodeSize(
    id,
    data,
    { width: defaultSize, height: defaultSize },
    40, // min width
    40  // min height
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
          background: "#fce7f3",
          border: "2px solid #db2777",
          borderRadius: "50%",
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer", // Añadir cursor pointer para indicar interactividad
        }}
        data={data} // Pasar datos para el tooltip
        nodeType="femenino" // Indicar el tipo de nodo para estilo adecuado
      >
        {/* Mostrar edad dentro del nodo si está disponible */}
        {age !== '' && (
          <div style={{ 
            fontSize: Math.max(14, size.width * 0.2),
            fontWeight: 'bold',
            color: '#db2777',
          }}>
            {age}
          </div>
        )}
      </BaseNodeComponent>
      
      {/* Información del nodo debajo - ahora solo mostramos el nombre */}
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
        
        {/* Campos de edición ocultos para mantener la funcionalidad de edición */}
        {editingField === 'age' && (
          <input
            value={age}
            onChange={(e) => handleSave('age', e.target.value)}
            onBlur={() => handleSave('age', age)}
            onKeyDown={(e) => handleKeyDown(e, 'age', age)}
            autoFocus
            style={{ width: "100%", textAlign: "center", fontSize: 12 }}
          />
        )}
        
        {editingField === 'profession' && (
          <input
            value={profession}
            onChange={(e) => handleSave('profession', e.target.value)}
            onBlur={() => handleSave('profession', profession)}
            onKeyDown={(e) => handleKeyDown(e, 'profession', profession)}
            autoFocus
            style={{ width: "100%", textAlign: "center", fontSize: 12 }}
          />
        )}
        
        {editingField === 'info' && (
          <textarea
            value={info}
            onChange={(e) => handleSave('info', e.target.value)}
            onBlur={() => handleSave('info', info)}
            autoFocus
            style={{ width: "100%", fontSize: 11, minHeight: 40 }}
          />
        )}
        
        {/* Pequeño indicador visual de info adicional como pequeño icono */}
        {(profession || info) && (
          <div 
            style={{ 
              fontSize: 10, 
              color: '#db2777', 
              textAlign: 'center',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '2px'
            }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
            <span>Info adicional</span>
          </div>
        )}
        
        {/* Identificador del nodo */}
        <div style={{ fontSize: 10, marginTop: 2, textAlign: "center", color: '#718096' }}>
          ID: {id}
        </div>
      </div>
    </div>
  );
};

export default FemeninoNode;