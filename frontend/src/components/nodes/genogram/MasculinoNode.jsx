import React, { useState } from 'react';
import BaseNodeComponent from './BaseNodeComponent';
import useResizable from '../../../hooks/useResizable';

const MasculinoNode = ({ data, id, selected }) => {
  // Estado para campos editables
  const [editingField, setEditingField] = useState(null);
  
  // Asegurarse de usar los valores desde data
  const name = data?.name || data?.label || 'Nombre';
  const age = data?.age !== undefined && data?.age !== null ? data.age : '';
  const profession = data?.profession || '';
  const info = data?.info || '';
  
  // Tamaño del nodo con un valor por defecto ligeramente más grande
  const defaultSize = data?.size || 65;
  
  // Usar el hook para gestionar el tamaño
  const [size, resizeHandleRef] = useResizable(
    id, 
    { width: defaultSize, height: defaultSize },
    45, // min width aumentado
    45  // min height aumentado
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

  // Calcular un gradiente sutil para el fondo del nodo 
  const bgGradient = 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)';
  
  // Preparar el contenido de la etiqueta para pasar a BaseNodeComponent
  const labelContent = (
    <div style={{ 
      width: Math.max(120, size.width + 20),
      padding: "3px 6px",
      backgroundColor: "transparent", // Fondo transparente para no tapar elementos debajo
      borderRadius: "4px",
      textAlign: "center",
    }}>
      {/* Nombre */}
      <div 
        onDoubleClick={() => handleEdit('name')}
        style={{ 
          fontWeight: "bold", 
          textAlign: "center", 
          cursor: "text",
          color: "#1e3a8a", 
          padding: "2px 0",
          textShadow: "0px 1px 2px rgba(255,255,255,0.8)" // Mejora legibilidad
        }}
      >
        {name}
      </div>
      
      {/* Pequeño indicador visual de info adicional */}
      {(profession || info) && (
        <div 
          style={{ 
            fontSize: 10, 
            color: '#3b82f6', 
            textAlign: 'center',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '2px',
            backgroundColor: "transparent",
            padding: "2px 5px",
            borderRadius: "3px",
            margin: "2px auto",
            width: "fit-content",
            textShadow: "0px 1px 2px rgba(255,255,255,0.8)" // Mejora legibilidad
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
      <div style={{ 
        fontSize: 9, 
        marginTop: 2, 
        textAlign: "center", 
        color: '#64748b',
        fontFamily: 'monospace',
        opacity: 0.7,
        textShadow: "0px 1px 2px rgba(255,255,255,0.7)" // Mejora legibilidad
      }}>
        ID: {id}
      </div>
    </div>
  );

  // Interfaces para edición de campos adicionales
  const editingInterfaces = (
    <>
      {/* Campo de edición de nombre (visible solo al editar) */}
      {editingField === 'name' && (
        <div
          style={{
            position: 'absolute',
            bottom: '-30px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
          }}
        >
          <input
            value={name}
            onChange={(e) => handleSave('name', e.target.value)}
            onBlur={() => handleSave('name', name)}
            onKeyDown={(e) => handleKeyDown(e, 'name', name)}
            autoFocus
            style={{ 
              width: Math.max(120, size.width),
              fontWeight: "bold", 
              textAlign: "center",
              padding: "2px 4px",
              borderRadius: "3px",
              border: "1px solid #2563eb"
            }}
          />
        </div>
      )}
      
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
          border: "2px solid #2563eb",
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "move",
          borderRadius: "0px", // Forma cuadrada para masculino
        }}
        data={data} // Pasar datos para el tooltip
        nodeType="masculino" // Indicar el tipo de nodo para estilo adecuado
        labelContent={labelContent} // Pasar el contenido de la etiqueta separado
      >
        {/* Mostrar edad dentro del nodo si está disponible */}
        {age !== '' && (
          <div style={{ 
            fontSize: Math.max(16, size.width * 0.25),
            fontWeight: 'bold',
            color: '#1e40af',
            textShadow: '0 1px 1px rgba(255,255,255,0.5)',
            pointerEvents: 'none' // Asegura que no responda a eventos de mouse
          }}>
            {age}
          </div>
        )}
      </BaseNodeComponent>
      
      {editingInterfaces}
    </>
  );
};

export default MasculinoNode;