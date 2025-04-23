import React, { useState, useEffect, useRef } from 'react';

/**
 * Componente para editar etiquetas personalizadas en las relaciones del genograma.
 * Permite añadir información contextual a las conexiones entre miembros de la familia.
 */
const RelationshipLabelEditor = ({ 
  selectedEdge, 
  onUpdateEdge, 
  edges, 
  setEdges 
}) => {
  const [label, setLabel] = useState('');
  const [labelType, setLabelType] = useState('normal');
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef(null);
  
  // Actualizar el estado cuando cambia el edge seleccionado
  useEffect(() => {
    if (selectedEdge && selectedEdge.data) {
      setLabel(selectedEdge.data.label || '');
      setLabelType(selectedEdge.data.labelType || 'normal');
    } else {
      setLabel('');
      setLabelType('normal');
    }
    // Resetear el modo de edición
    setIsEditing(false);
  }, [selectedEdge]);
  
  // Auto-focus en el input cuando se activa el modo de edición
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);
  
  // Guardar los cambios en la etiqueta
  const handleSave = () => {
    if (selectedEdge && onUpdateEdge) {
      const updatedData = {
        ...selectedEdge.data,
        label,
        labelType
      };
      
      onUpdateEdge(selectedEdge.id, updatedData);
      
      // También actualizar el array de edges si está disponible
      if (edges && setEdges) {
        const updatedEdges = edges.map(edge => 
          edge.id === selectedEdge.id 
            ? { ...edge, data: { ...edge.data, label, labelType } }
            : edge
        );
        setEdges(updatedEdges);
      }
    }
    
    setIsEditing(false);
  };
  
  // Cancelar la edición
  const handleCancel = () => {
    if (selectedEdge && selectedEdge.data) {
      setLabel(selectedEdge.data.label || '');
      setLabelType(selectedEdge.data.labelType || 'normal');
    }
    setIsEditing(false);
  };
  
  // Si no hay edge seleccionado, no mostrar nada
  if (!selectedEdge) {
    return null;
  }
  
  // Estilos según el tipo de etiqueta
  const getLabelStyle = (type) => {
    switch (type) {
      case 'conflict':
        return { 
          backgroundColor: '#fee2e2',
          color: '#b91c1c',
          border: '1px solid #fecaca'
        };
      case 'positive':
        return { 
          backgroundColor: '#dcfce7',
          color: '#166534',
          border: '1px solid #bbf7d0'
        };
      case 'neutral':
        return { 
          backgroundColor: '#e0f2fe',
          color: '#0369a1',
          border: '1px solid #bae6fd'
        };
      case 'ambivalent':
        return { 
          backgroundColor: '#fef9c3',
          color: '#854d0e',
          border: '1px solid #fef08a'
        };
      default:
        return { 
          backgroundColor: '#f8fafc',
          color: '#334155',
          border: '1px solid #e2e8f0'
        };
    }
  };
  
  return (
    <div style={{
      padding: '12px',
      backgroundColor: '#f1f5f9',
      borderRadius: '8px',
      marginBottom: '15px'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '10px'
      }}>
        <h4 style={{ 
          margin: 0, 
          color: '#334155',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 8.4c0-.55.45-1 1-1h2.4c.55 0 1 .45 1 1v1.2c0 .55-.45 1-1 1H7c-.55 0-1-.45-1-1V8.4ZM14.6 12c0-.55.45-1 1-1H18c.55 0 1 .45 1 1v1.2c0 .55-.45 1-1 1h-2.4c-.55 0-1-.45-1-1V12Z"/>
            <path d="M2 12h4M18 6c1.1 0 2 .9 2 2M22 12h-4M6 12h12M12 2v4M12 18v4M18 18c1.1 0 2-.9 2-2M6 6c-1.1 0-2 .9-2 2M6 18c-1.1 0-2-.9-2-2"/>
          </svg>
          Etiqueta de Relación
        </h4>
        
        {!isEditing && label && (
          <button
            onClick={() => setIsEditing(true)}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: '#0284c7',
              cursor: 'pointer',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Editar
          </button>
        )}
      </div>
      
      {isEditing ? (
        <>
          <div style={{ marginBottom: '10px' }}>
            <label 
              htmlFor="relationship-label"
              style={{
                display: 'block',
                marginBottom: '6px',
                fontSize: '13px',
                color: '#475569'
              }}
            >
              Descripción:
            </label>
            <input
              ref={inputRef}
              id="relationship-label"
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Describir la relación..."
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '14px'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label 
              style={{
                display: 'block',
                marginBottom: '6px',
                fontSize: '13px',
                color: '#475569'
              }}
            >
              Tipo de relación:
            </label>
            <div style={{ 
              display: 'flex', 
              gap: '8px', 
              flexWrap: 'wrap'
            }}>
              {[
                { id: 'normal', name: 'Normal' },
                { id: 'positive', name: 'Positiva' },
                { id: 'conflict', name: 'Conflictiva' },
                { id: 'neutral', name: 'Neutral' },
                { id: 'ambivalent', name: 'Ambivalente' }
              ].map((type) => (
                <button
                  key={type.id}
                  onClick={() => setLabelType(type.id)}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    border: labelType === type.id ? '2px solid #0284c7' : '1px solid #cbd5e1',
                    cursor: 'pointer',
                    backgroundColor: labelType === type.id ? '#e0f2fe' : '#fff',
                    color: labelType === type.id ? '#0284c7' : '#475569',
                    fontWeight: labelType === type.id ? 'bold' : 'normal'
                  }}
                >
                  {type.name}
                </button>
              ))}
            </div>
          </div>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            gap: '8px'
          }}>
            <button
              onClick={handleCancel}
              style={{
                padding: '6px 12px',
                borderRadius: '4px',
                fontSize: '13px',
                border: '1px solid #cbd5e1',
                cursor: 'pointer',
                backgroundColor: '#fff',
                color: '#475569'
              }}
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              style={{
                padding: '6px 12px',
                borderRadius: '4px',
                fontSize: '13px',
                border: '1px solid #0284c7',
                cursor: 'pointer',
                backgroundColor: '#0284c7',
                color: '#fff'
              }}
            >
              Guardar
            </button>
          </div>
        </>
      ) : label ? (
        <div 
          style={{
            padding: '10px',
            borderRadius: '6px',
            fontSize: '14px',
            ...getLabelStyle(labelType)
          }}
        >
          {label}
        </div>
      ) : (
        <button
          onClick={() => setIsEditing(true)}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#f8fafc',
            border: '1px dashed #cbd5e1',
            borderRadius: '6px',
            cursor: 'pointer',
            color: '#64748b',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '5px'
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          Añadir etiqueta
        </button>
      )}
    </div>
  );
};

export default RelationshipLabelEditor;