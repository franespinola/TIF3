import React, { useState } from 'react';
import BaseNodeComponent from './BaseNodeComponent';
import useResizable from '../../../hooks/useResizable';

const FallecidoMNode = ({ data, id, selected }) => {
  // Estado para campos editables
  const [editingField, setEditingField] = useState(null);
  
  // Asegurarse de usar los valores desde data
  const name = data?.name || data?.label || 'Nombre';
  const age = data?.age !== undefined && data?.age !== null ? data.age : '';
  const profession = data?.profession || '';
  const info = data?.info || '';
  const causeOfDeath = data?.causeOfDeath || '';
  
  // Tamaño del nodo con un valor por defecto
  const defaultSize = data?.size || 65;
  
  // Usar el hook para gestionar el tamaño
  const [size, resizeHandleRef, isResizing, setSize] = useResizable(
    id, 
    { width: defaultSize, height: defaultSize },
    45, // min width
    45  // min height
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
        case 'causeOfDeath':
          updates.causeOfDeath = value;
          break;
        default:
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

  // Definir el gradiente para el fondo del nodo
  const bgGradient = 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)';
  
  // Preparar el contenido de la etiqueta para pasar a BaseNodeComponent
  const labelContent = (
    <div style={{ 
      width: Math.max(120, size.width + 20),
      padding: "3px 6px",
      backgroundColor: "transparent",
      borderRadius: "4px",
      textAlign: "center",
    }}>
      {/* Nombre */}
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
            padding: "2px 4px",
            borderRadius: "3px",
            border: "1px solid #2563eb"
          }}
        />
      ) : (
        <div 
          onDoubleClick={() => handleEdit('name')}
          style={{ 
            fontWeight: "bold", 
            textAlign: "center", 
            cursor: "text",
            color: "#1e3a8a", 
            padding: "2px 0",
            textDecoration: "line-through", // Indicador de fallecido
            textShadow: "0px 1px 2px rgba(255,255,255,0.8)"
          }}
        >
          {name}
        </div>
      )}
      
      {/* Causa de muerte (si existe) */}
      {causeOfDeath && (
        <div style={{ 
          fontSize: 10,
          color: '#7f1d1d',
          fontStyle: 'italic',
          textAlign: 'center',
          padding: '1px 0',
          textShadow: "0px 1px 1px rgba(255,255,255,0.7)"
        }}>
          {causeOfDeath}
        </div>
      )}
      
      {/* Profesión (si existe) */}
      {profession && (
        <div style={{ 
          fontSize: 10,
          color: '#1e40af',
          fontStyle: 'italic',
          textAlign: 'center',
          padding: '1px 0',
          textShadow: "0px 1px 1px rgba(255,255,255,0.7)"
        }}>
          {profession}
        </div>
      )}
      
      {/* Información adicional (si existe) */}
      {info && (
        <div 
          onDoubleClick={() => handleEdit('info')}
          style={{ 
            fontSize: 9,
            color: '#1e3a8a',
            textAlign: 'center',
            padding: '1px 0',
            cursor: 'text',
            textShadow: "0px 1px 2px rgba(255,255,255,0.7)"
          }}
        >
          {info}
        </div>
      )}
      
      {/* Identificador del nodo */}
      <div style={{ 
        fontSize: 9, 
        marginTop: 2, 
        textAlign: "center", 
        color: '#64748b',
        fontFamily: 'monospace',
        opacity: 0.7,
        textShadow: "0px 1px 2px rgba(255,255,255,0.7)"
      }}>
        ID: {id}
      </div>
    </div>
  );

  // Interfaces para edición de campos adicionales
  const editingInterfaces = (
    <>
      {/* Campos de edición ocultos (aparecen cuando se activan) */}
      {editingField === 'age' && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
            marginTop: '30px',
          }}
        >
          <input
            value={age}
            onChange={(e) => handleSave('age', e.target.value)}
            onBlur={() => handleSave('age', age)}
            onKeyDown={(e) => handleKeyDown(e, 'age', age)}
            autoFocus
            style={{ width: "100%", textAlign: "center", fontSize: 12 }}
          />
        </div>
      )}
      
      {editingField === 'profession' && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
            marginTop: '30px',
          }}
        >
          <input
            value={profession}
            onChange={(e) => handleSave('profession', e.target.value)}
            onBlur={() => handleSave('profession', profession)}
            onKeyDown={(e) => handleKeyDown(e, 'profession', profession)}
            autoFocus
            style={{ width: "100%", textAlign: "center", fontSize: 12 }}
          />
        </div>
      )}
      
      {editingField === 'info' && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
            marginTop: '30px',
          }}
        >
          <textarea
            value={info}
            onChange={(e) => handleSave('info', e.target.value)}
            onBlur={() => handleSave('info', info)}
            autoFocus
            style={{ width: "100%", fontSize: 11, minHeight: 40 }}
          />
        </div>
      )}
      
      {editingField === 'causeOfDeath' && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
            marginTop: '30px',
          }}
        >
          <input
            value={causeOfDeath}
            onChange={(e) => handleSave('causeOfDeath', e.target.value)}
            onBlur={() => handleSave('causeOfDeath', causeOfDeath)}
            onKeyDown={(e) => handleKeyDown(e, 'causeOfDeath', causeOfDeath)}
            autoFocus
            placeholder="Causa de fallecimiento"
            style={{ width: "100%", textAlign: "center", fontSize: 12 }}
          />
        </div>
      )}
    </>
  );

  return (
    <>
      <BaseNodeComponent
        selected={selected}
        resizeHandleRef={resizeHandleRef}
        isConnectable={isConnectable}
        nodeStyles={{
          width: size.width,
          height: size.height,
          background: bgGradient,
          border: "2px solid #2563eb",
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "move",
          borderRadius: "0px", // Forma cuadrada para masculino
        }}
        data={data}
        nodeType="masculino"
        labelContent={labelContent}
      >
        {/* Mostrar edad dentro del nodo si está disponible */}
        {age !== '' && (
          <div style={{ 
            fontSize: Math.max(16, size.width * 0.25),
            fontWeight: 'bold',
            color: '#1e40af',
            textShadow: '0 1px 1px rgba(255,255,255,0.5)',
            pointerEvents: 'none'
          }}>
            {age}
          </div>
        )}
        
        {/* SVG para la X que va de esquina a esquina exactamente */}
        <svg
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            overflow: 'visible'
          }}
          viewBox={`0 0 ${size.width} ${size.height}`}
          preserveAspectRatio="none"
        >
          <line
            x1="0"
            y1="0"
            x2={size.width}
            y2={size.height}
            stroke="rgb(79, 70, 229)"
            strokeWidth={Math.max(2, size.width / 25)}
            pointerEvents="none"
          />
          <line
            x1={size.width}
            y1="0"
            x2="0"
            y2={size.height}
            stroke="rgb(79, 70, 229)"
            strokeWidth={Math.max(2, size.width / 25)}
            pointerEvents="none"
          />
        </svg>
      </BaseNodeComponent>
      
      {editingInterfaces}
    </>
  );
};

export default FallecidoMNode;