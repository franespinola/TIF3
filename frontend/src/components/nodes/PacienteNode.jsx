import React, { useState } from 'react';
import BaseNodeComponent from './BaseNodeComponent';
import useNodeSize from '../../hooks/useNodeSize';

const PacienteNode = ({ data, id, selected }) => {
  // Estado para campos editables
  const [editingField, setEditingField] = useState(null);
  
  // Asegurarse de usar los valores desde data
  const name = data?.name || data?.label || 'Paciente';
  const age = data?.age !== undefined && data?.age !== null ? data.age : '';
  const profession = data?.profession || '';
  const info = data?.info || '';
  
  // Tamaño del nodo un poco más grande para destacar al paciente principal
  const defaultSize = data?.size || 75;
  
  // Usar el hook para gestionar el tamaño
  const [size, resizeHandleRef, isResizing] = useNodeSize(
    id,
    data,
    { width: defaultSize, height: defaultSize },
    55, // min width aumentado
    55  // min height aumentado
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

  // Gradiente para el nodo del paciente con efecto más pronunciado
  const bgGradient = 'linear-gradient(135deg, #dcfce7 0%, #a7f3d0 100%)';

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <BaseNodeComponent
        selected={selected}
        resizeHandleRef={resizeHandleRef}
        isConnectable={isConnectable}
        nodeStyles={{
          width: size.width,
          height: size.height,
          background: bgGradient,
          border: "3px solid #047857",
          borderRadius: "12px",
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "move",
          boxShadow: selected ? 
            "0 4px 12px rgba(4, 120, 87, 0.25), inset 0 0 6px rgba(255, 255, 255, 0.5)" : 
            "0 3px 8px rgba(4, 120, 87, 0.15), inset 0 0 4px rgba(255, 255, 255, 0.5)",
          transition: "all 0.2s ease"
        }}
        data={data}
        nodeType="paciente"
      >
        {/* Mostrar edad dentro del nodo si está disponible */}
        {age !== '' && (
          <div style={{ 
            fontSize: Math.max(16, size.width * 0.25),
            fontWeight: 'bold',
            color: '#065f46',
            textShadow: '0 1px 1px rgba(255,255,255,0.75)',
          }}>
            {age}
          </div>
        )}
        
        {/* Indicador visual mejorado de que es el paciente principal */}
        <div style={{
          position: 'absolute',
          bottom: -6,
          right: -6,
          width: 20,
          height: 20,
          borderRadius: '50%',
          backgroundColor: '#047857',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          border: '2px solid white',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
        }}>
          <span style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>P</span>
        </div>
      </BaseNodeComponent>
      
      {/* Información del nodo debajo con estilo mejorado */}
      <div style={{ 
        marginTop: 8, 
        width: Math.max(130, size.width + 20),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: "4px 8px",
        backgroundColor: "rgba(255,255,255,0.8)",
        borderRadius: "6px",
        backdropFilter: "blur(2px)",
      }}>
        {/* Nombre del paciente */}
        {editingField === 'name' ? (
          <input
            value={name}
            onChange={(e) => handleSave('name', e.target.value)}
            onBlur={() => handleSave('name', name)}
            onKeyDown={(e) => handleKeyDown(e, 'name', name)}
            autoFocus
            style={{ 
              width: "100%", 
              fontWeight: "bold", 
              textAlign: "center",
              padding: "3px 5px",
              borderRadius: "4px",
              border: "1px solid #047857",
              fontSize: 14
            }}
          />
        ) : (
          <div 
            onDoubleClick={() => handleEdit('name')}
            style={{ 
              fontWeight: "bold", 
              textAlign: "center", 
              cursor: "text",
              fontSize: 15,
              color: '#065f46',
              padding: "2px 0"
            }}
          >
            {name}
          </div>
        )}
        
        {/* Etiqueta de paciente principal con diseño mejorado */}
        <div style={{
          fontSize: 11,
          color: '#065f46',
          backgroundColor: '#ecfdf5',
          padding: '3px 10px',
          borderRadius: '12px',
          marginTop: 3,
          fontWeight: 'bold',
          border: '1px solid #10b981',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          Paciente Principal
        </div>
        
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
        
        {/* Indicador visual de información adicional */}
        {(profession || info) && (
          <div 
            style={{ 
              fontSize: 10, 
              color: '#047857', 
              textAlign: 'center',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '2px',
              marginTop: 3,
              backgroundColor: "rgba(209,250,229,0.5)",
              padding: "2px 5px",
              borderRadius: "3px",
              width: "fit-content"
            }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
            <span>Info adicional</span>
          </div>
        )}
        
        {/* Identificador del nodo con estilo sutil */}
        <div style={{ 
          fontSize: 9, 
          marginTop: 2, 
          textAlign: "center", 
          color: '#64748b',
          fontFamily: 'monospace',
          opacity: 0.7
        }}>
          ID: {id}
        </div>
      </div>
    </div>
  );
};

export default PacienteNode;