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
  
  // Tamaño del nodo
  const defaultSize = data?.size || 70; // Un poco más grande por defecto
  
  // Usar el hook para gestionar el tamaño
  const [size, resizeHandleRef, isResizing] = useNodeSize(
    id,
    data,
    { width: defaultSize, height: defaultSize },
    50, // min width
    50  // min height
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
          background: "#dcfce7",
          border: "3px solid #047857",
          borderRadius: "10px",
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
        }}
        data={data}
        nodeType="paciente"
      >
        {/* Mostrar edad dentro del nodo si está disponible */}
        {age !== '' && (
          <div style={{ 
            fontSize: Math.max(14, size.width * 0.2),
            fontWeight: 'bold',
            color: '#047857',
          }}>
            {age}
          </div>
        )}
        
        {/* Pequeño indicador visual de que es el paciente principal */}
        <div style={{
          position: 'absolute',
          bottom: -5,
          right: -5,
          width: 16,
          height: 16,
          borderRadius: '50%',
          backgroundColor: '#047857',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          border: '2px solid white',
        }}>
          <span style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>P</span>
        </div>
      </BaseNodeComponent>
      
      {/* Información del nodo debajo - ahora solo mostramos el nombre */}
      <div style={{ 
        marginTop: 4, 
        width: Math.max(120, size.width + 20),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        {/* Nombre con etiqueta de "Paciente" */}
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
            style={{ 
              fontWeight: "bold", 
              textAlign: "center", 
              cursor: "text",
              fontSize: 14,
              color: '#047857'
            }}
          >
            {name}
          </div>
        )}
        
        {/* Indicador de paciente principal */}
        <div style={{
          fontSize: 10,
          color: '#047857',
          backgroundColor: '#dcfce7',
          padding: '2px 8px',
          borderRadius: '10px',
          marginTop: 2,
          fontWeight: 'bold'
        }}>
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
        
        {/* Pequeño indicador visual de info adicional como pequeño icono */}
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
              marginTop: 2
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

export default PacienteNode;