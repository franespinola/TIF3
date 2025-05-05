import React, { useState, useEffect, useRef } from 'react';
import { Handle, Position } from 'reactflow';
import FlowchartTooltipPortal from './FlowchartTooltipPortal';
import NodeResizeControl from '../NodeResizeControl';

/**
 * Componente base para todos los nodos de diagrama de flujo
 * que proporciona la funcionalidad de tooltip al hacer hover
 * y edición de descripción al hacer click
 */
const FlowchartNodeBase = ({ 
  children, 
  id, 
  selected,
  nodeType,
  data,
  tooltipPreview,
  onResize,
  dimensions = { width: 100, height: 80 },
  minWidth = 60,
  minHeight = 40,
  description
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipTimer, setTooltipTimer] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(description || data?.description || '');
  const nodeRef = useRef(null);
  const editInputRef = useRef(null);
  const [hoverDebugCount, setHoverDebugCount] = useState(0); // Para debugging
  const [uniqueId] = useState(() => `node-${Math.random().toString(36).substring(7)}`); // ID único para logs

  // Iniciar edición si es un nodo recién creado con initialEdit=true
  useEffect(() => {
    if (data?.initialEdit && !isEditing) {
      console.log(`🖊️ NODO [${uniqueId}]: Activando edición inicial para ${nodeType} (${id})`);
      setIsEditing(true);
      // Eliminar la flag initialEdit después de usarla
      if (data.onEdit) {
        const newData = { ...data };
        delete newData.initialEdit;
        data.onEdit(id, data.label || '', newData);
      }
    }
  }, [data, id, nodeType, uniqueId, isEditing]);

  // Manejador para el evento global activateNodeEdit
  useEffect(() => {
    const handleActivateNodeEdit = (event) => {
      if (event.detail && event.detail.nodeId === id) {
        console.log(`🖊️ NODO [${uniqueId}]: Activando edición desde evento global para ${nodeType} (${id})`);
        setIsEditing(true);
      }
    };

    document.addEventListener('activateNodeEdit', handleActivateNodeEdit);
    return () => {
      document.removeEventListener('activateNodeEdit', handleActivateNodeEdit);
    };
  }, [id, nodeType, uniqueId]);

  // Enfocar el input cuando se activa el modo de edición
  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [isEditing]);

  // Función para manejar doble clic en el nodo para editar
  const handleDoubleClick = () => {
    console.log(`🖊️ NODO [${uniqueId}]: Double click en ${nodeType} (${id})`);
    setIsEditing(true);
  };

  // Función para guardar los cambios de la descripción
  const handleSaveEdit = () => {
    console.log(`💾 NODO [${uniqueId}]: Guardando edición para ${nodeType} (${id})`, editText);
    setIsEditing(false);
    
    // Actualizar la descripción en el data del nodo
    if (data.onEdit) {
      // Si hay descripción previa, actualizarla, si no, crear nueva propiedad
      const newData = { ...data, description: editText };
      data.onEdit(id, data.label || '', newData);
    }
  };

  // Actualizar el estado interno cuando los datos cambian externamente
  useEffect(() => {
    // Sincronizar la descripción si cambia externamente
    if (data?.description !== undefined && data.description !== editText) {
      setEditText(data.description);
    }
  }, [data, editText]);

  // Manejar tecla Enter para guardar y Escape para cancelar
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditText(description || data?.description || '');
    }
  };

  // Mejorar el manejo de eventos de hover
  const handleMouseEnter = (e) => {
    // Si estamos editando, no mostrar tooltip
    if (isEditing) return;
    
    console.log(`🟢 NODO [${uniqueId}]: Mouse entró en ${nodeType} (${id})`, {
      target: e.target.className, 
      currentTarget: e.currentTarget.className,
      clientX: e.clientX,
      clientY: e.clientY
    });
    
    // Incrementamos el contador de hover para debugging
    setHoverDebugCount(prev => prev + 1);
    
    // Limpiamos cualquier timer previo
    if (tooltipTimer) {
      clearTimeout(tooltipTimer);
      setTooltipTimer(null);
    }
    
    // Log del estado del nodo
    const rect = nodeRef.current?.getBoundingClientRect();
    console.log(`🟢 NODO [${uniqueId}]: Posición del nodo:`, rect || 'No disponible');
    
    // Creamos un nuevo timer con delay
    const timer = setTimeout(() => {
      console.log(`🟢 NODO [${uniqueId}]: ACTIVANDO tooltip para ${nodeType}`);
      setShowTooltip(true);
    }, 300);
    
    setTooltipTimer(timer);
  };
  
  const handleMouseLeave = (e) => {
    // Si estamos editando, no ocultar tooltip
    if (isEditing) return;
    
    console.log(`🔴 NODO [${uniqueId}]: Mouse salió de ${nodeType} (${id})`, {
      target: e.target.className, 
      currentTarget: e.currentTarget.className,
      clientX: e.clientX,
      clientY: e.clientY,
      relatedTarget: e.relatedTarget?.className || 'unknown' // Muestra a qué elemento va el mouse
    });
    
    // Limpiamos cualquier timer previo
    if (tooltipTimer) {
      clearTimeout(tooltipTimer);
      setTooltipTimer(null);
    }
    
    // Creamos un nuevo timer con delay más corto
    // El portal se encargará de mantenerlo visible si el mouse entra en él
    const timer = setTimeout(() => {
      console.log(`🔴 NODO [${uniqueId}]: DESACTIVANDO tooltip para ${nodeType}`);
      setShowTooltip(false);
    }, 100);
    
    setTooltipTimer(timer);
  };

  // Efectos para tracking de estado
  useEffect(() => {
    console.log(`📊 NODO [${uniqueId}] ${nodeType}: Estado tooltip cambiado a ${showTooltip}`);
  }, [showTooltip, uniqueId, nodeType]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (tooltipTimer) {
        clearTimeout(tooltipTimer);
        console.log(`🟠 NODO [${uniqueId}]: Limpiando timers al desmontar`);
      }
    };
  }, [tooltipTimer, uniqueId]);
  
  // Añadir un log cuando el componente se monta/actualiza para debugging
  useEffect(() => {
    console.log(`🔧 NODO [${uniqueId}]: ${nodeType} (${id}) montado o actualizado.`, { 
      refIsValid: !!nodeRef.current,
      dimensions,
      description,
      styles: {
        textColor: data?.textColor,
        fontSize: data?.fontSize,
        fontFamily: data?.fontFamily,
        textAlign: data?.textAlign,
        fontWeight: data?.fontWeight,
        fontStyle: data?.fontStyle,
        textDecoration: data?.textDecoration,
      }
    });
    
    // Verificar que la referencia está correctamente asignada
    if (nodeRef.current) {
      // Añadir un atributo data para verificar visualmente
      nodeRef.current.setAttribute('data-flowchart-node', nodeType);
      nodeRef.current.setAttribute('data-node-id', uniqueId);
    }
    
    return () => {
      console.log(`🟠 NODO [${uniqueId}]: ${nodeType} (${id}) desmontado`);
    };
  }, [id, nodeType, uniqueId, dimensions, description, data]);

  // Obtener los estilos aplicados desde la barra de herramientas
  const getAppliedStyles = () => {
    if (!data) return {};
    
    return {
      color: data.textColor || data.color,
      fontSize: data.fontSize ? 
                (data.fontSize.toString().includes('pt') ? 
                  `${parseInt(data.fontSize)}px` : 
                  data.fontSize) : undefined,
      fontFamily: data.fontFamily,
      fontWeight: data.bold ? 'bold' : data.fontWeight,
      fontStyle: data.italic ? 'italic' : data.fontStyle,
      textDecoration: data.underline ? 'underline' : data.textDecoration,
      textAlign: data.textAlign && data.textAlign.includes('-') ? 
                  data.textAlign.split('-')[1] : 
                  data.textAlign
    };
  };

  return (
    <div 
      className="flowchart-node"
      style={{ 
        position: 'relative',
        cursor: 'pointer', // Indicador visual de que es interactivo
        border: showTooltip ? '2px solid yellow' : undefined, // Visual para debugging: resaltar el nodo cuando se muestra su tooltip
        ...getAppliedStyles() // Aplicar estilos de texto desde la barra de herramientas
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onDoubleClick={handleDoubleClick}
      ref={nodeRef}
      data-tooltip={`${showTooltip}`} // Atributo para debugging
      data-hover-count={hoverDebugCount} // Atributo para debugging
      data-node-type={nodeType}
      data-node-id={uniqueId}
    >
      {children}

      {/* Un pequeño indicador visual de que este nodo tiene tooltip */}
      <div 
        style={{
          position: 'absolute',
          top: -3,
          right: -3,
          width: 8,
          height: 8,
          backgroundColor: showTooltip ? '#ff0000' : '#3b82f6', // Rojo cuando activo, azul cuando inactivo
          borderRadius: '50%',
          border: '1px solid white',
          pointerEvents: 'none', // Para que no interfiera con los eventos
          transition: 'background-color 0.3s ease',
        }} 
      />

      {/* Campo de edición de descripción */}
      {isEditing && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            zIndex: 1000,
            backgroundColor: 'white',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
            padding: '10px',
            borderRadius: '5px',
            minWidth: '200px',
            maxWidth: '300px',
          }}
        >
          <textarea
            ref={editInputRef}
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              minHeight: '80px',
              fontSize: '14px',
              fontFamily: 'inherit',
            }}
            placeholder="Añade una descripción..."
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px', gap: '8px' }}>
            <button
              onClick={() => {
                setIsEditing(false);
                setEditText(description || data?.description || '');
              }}
              style={{
                padding: '5px 10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                background: '#f5f5f5',
                cursor: 'pointer',
              }}
            >
              Cancelar
            </button>
            <button
              onClick={handleSaveEdit}
              style={{
                padding: '5px 10px',
                border: 'none',
                borderRadius: '4px',
                background: '#3b82f6',
                color: 'white',
                cursor: 'pointer',
              }}
            >
              Guardar
            </button>
          </div>
        </div>
      )}

      {/* Tooltip avanzado renderizado en un portal - solo si no estamos editando */}
      {!isEditing && (
        <FlowchartTooltipPortal
          show={showTooltip}
          data={{
            text: data?.text || '',
            description: description || data?.description,
            nodeId: id,
            uniqueId: uniqueId,
          }}
          nodeType={nodeType}
          preview={tooltipPreview}
          targetRef={nodeRef}
        />
      )}

      {/* Handles estándar para conexión */}
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        style={{ background: '#555', width: 8, height: 8 }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        style={{ background: '#555', width: 8, height: 8 }}
      />
      <Handle
        type="source"
        position={Position.Left}
        id="left"
        style={{ background: '#555', width: 8, height: 8 }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        style={{ background: '#555', width: 8, height: 8 }}
      />

      {/* Control de redimensionamiento */}
      {selected && onResize && (
        <NodeResizeControl
          position="bottom-right"
          onResize={onResize}
          initialWidth={dimensions.width}
          initialHeight={dimensions.height}
          minWidth={minWidth}
          minHeight={minHeight}
        />
      )}
    </div>
  );
};

export default FlowchartNodeBase;