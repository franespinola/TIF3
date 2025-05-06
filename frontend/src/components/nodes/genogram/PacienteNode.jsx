import React, { useState } from 'react';
import BaseNodeComponent from './BaseNodeComponent';
import useResizable from '../../../hooks/useResizable';

const PacienteNode = ({ data, id, selected }) => {
  // Estado para campos editables
  const [editingField, setEditingField] = useState(null);
  
  // Asegurarse de usar los valores desde data
  const name = data?.name || data?.label || 'Paciente';
  const age = data?.age !== undefined && data?.age !== null ? data.age : '';
  const profession = data?.profession || '';
  const info = data?.info || '';
  
  // Tamaño del nodo con un valor por defecto
  const defaultSize = data?.size || 70;
  
  // Usar el hook para gestionar el tamaño
  const [size, resizeHandleRef] = useResizable(
    id, 
    { width: defaultSize, height: defaultSize },
    50, // min size
    50  // min size
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
  
  // Calcular un gradiente para el fondo del nodo
  const bgGradient = 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)';
  
  // Preparar el contenido de la etiqueta para pasar a BaseNodeComponent
  const labelContent = (
    <div style={{ 
      width: Math.max(120, size.width + 20),
      padding: "3px 6px",
      backgroundColor: "transparent",
      borderRadius: "4px",
      textAlign: "center",
    }}>
      {/* Etiqueta de "Paciente principal" */}
      <div style={{
        backgroundColor: 'rgba(22, 163, 74, 0.2)',
        fontSize: 10,
        fontWeight: 'bold',
        color: '#166534',
        padding: '2px 5px',
        borderRadius: '4px',
        display: 'inline-block',
        marginBottom: '2px',
        textShadow: "0px 1px 2px rgba(255,255,255,0.6)"
      }}>
        Paciente Principal
      </div>

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
            border: "1px solid #16a34a"
          }}
        />
      ) : (
        <div 
          onDoubleClick={() => handleEdit('name')}
          style={{ 
            fontWeight: "bold", 
            textAlign: "center", 
            cursor: "text",
            color: "#166534", 
            padding: "2px 0",
            textShadow: "0px 1px 2px rgba(255,255,255,0.8)"
          }}
        >
          {name}
        </div>
      )}
      
      {/* Profesión (si existe) */}
      {profession && (
        <div style={{ 
          fontSize: 10,
          color: '#15803d',
          fontStyle: 'italic',
          textAlign: 'center',
          padding: '1px 0',
          textShadow: "0px 1px 2px rgba(255,255,255,0.7)"
        }}>
          {profession}
        </div>
      )}
      
      {/* Información adicional (si existe) */}
      {info && (
        <div style={{ 
          fontSize: 9,
          color: '#4d7c0f',
          textAlign: 'center',
          padding: '1px 4px',
          margin: '1px 0',
          backgroundColor: 'rgba(220, 252, 231, 0.4)',
          borderRadius: '3px',
          maxWidth: Math.max(150, size.width * 1.5),
          maxHeight: 50,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          textShadow: "0px 1px 2px rgba(255,255,255,0.7)"
        }}>
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
          border: "2px solid #16a34a",
          position: "relative",
          borderRadius: "0px", // Forma cuadrada para el paciente principal
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "move",
          boxShadow: selected ? "0 0 0 2px #4ade80, 0 0 8px rgba(74, 222, 128, 0.6)" : undefined,
        }}
        data={data}
        nodeType="paciente"
        labelContent={labelContent}
      >
        {/* Mostrar edad dentro del nodo si está disponible */}
        {age !== '' && (
          <div style={{ 
            fontSize: Math.max(16, size.width * 0.25),
            fontWeight: 'bold',
            color: '#15803d',
            textShadow: '0 1px 1px rgba(255,255,255,0.7)',
            pointerEvents: 'none'
          }}>
            {age}
          </div>
        )}
        
        {/* Marcador especial doble línea para indicar que es el paciente principal */}
        <div style={{ 
          position: 'absolute',
          top: -6,
          right: -6,
          width: 14,
          height: 14,
          backgroundColor: '#dcfce7',
          borderRadius: '50%',
          border: '2px solid #16a34a',
          pointerEvents: 'none'
        }}></div>
      </BaseNodeComponent>
      
      {editingInterfaces}
    </>
  );
};

export default PacienteNode;