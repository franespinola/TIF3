import React, { useState } from 'react';
import BaseNodeComponent from './BaseNodeComponent';
import useResizable from '../../../hooks/useResizable';

const DesconocidoNode = ({ data, id, selected }) => {
  // Estado para campos editables
  const [editingField, setEditingField] = useState(null);
  
  // Asegurarse de usar los valores desde data
  const name = data?.name || data?.label || 'Desconocido';
  const info = data?.info || '';
  
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
  
  // Preparar el contenido de la etiqueta para pasar a BaseNodeComponent
  const labelContent = (
    <div style={{ 
      width: Math.max(120, size.width + 20),
      padding: "3px 6px",
      backgroundColor: "transparent",
      borderRadius: "4px",
      textAlign: "center",
    }}>
      {/* Etiqueta de perfil */}
      <div style={{
        fontSize: 10,
        fontWeight: 'bold',
        color: '#525252',
        padding: '2px 5px',
        borderRadius: '4px',
        display: 'inline-block',
        marginBottom: '2px',
        textShadow: "0px 1px 2px rgba(255,255,255,0.6)"
      }}>
        Perfil desconocido
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
            border: "1px solid #737373"
          }}
        />
      ) : (
        <div 
          onDoubleClick={() => handleEdit('name')}
          style={{ 
            fontWeight: "bold", 
            textAlign: "center", 
            cursor: "text",
            color: "#404040", 
            padding: "2px 0",
            textShadow: "0px 1px 2px rgba(255,255,255,0.8)"
          }}
        >
          {name}
        </div>
      )}
      
      {/* Información adicional (si existe) */}
      {info && (
        <div 
          onDoubleClick={() => handleEdit('info')}
          style={{ 
            fontSize: 9,
            color: '#525252',
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
          background: 'linear-gradient(135deg, #e5e5e5 0%, #d4d4d4 100%)',
          border: "2px dashed #737373",
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "move",
          borderRadius: "6px",
        }}
        data={data}
        nodeType="desconocido"
        labelContent={labelContent}
      >
        {/* Signo de interrogación grande al centro */}
        <div style={{ 
          fontSize: Math.max(30, size.width * 0.4),
          fontWeight: 'bold',
          color: '#737373',
          textShadow: '0 1px 1px rgba(255,255,255,0.5)',
          pointerEvents: 'none'
        }}>
          ?
        </div>
      </BaseNodeComponent>
      
      {editingInterfaces}
    </>
  );
};

export default DesconocidoNode;