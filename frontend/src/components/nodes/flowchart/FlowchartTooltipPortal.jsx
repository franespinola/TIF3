import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import FlowchartTooltip from './FlowchartTooltip';

/**
 * Componente Portal para renderizar el tooltip fuera de la jerarquía del DOM
 * Esto asegura que el tooltip no sea afectado por overflow: hidden o z-index
 * en contenedores padres.
 */
const FlowchartTooltipPortal = ({ show, data, nodeType, preview, targetRef }) => {
  // Creamos un elemento div que permanecerá constante entre renders
  const [portalNode] = useState(() => {
    console.log('🟣 INICIANDO PORTAL: Creando div para portal');
    const node = document.createElement('div');
    node.className = 'flowchart-tooltip-portal';
    node.style.position = 'fixed'; // Usamos position fixed para asegurar posicionamiento
    node.style.left = '0';
    node.style.top = '0';
    node.style.zIndex = '9999'; // z-index alto para estar por encima de todo
    node.style.pointerEvents = 'none'; // Inicialmente sin interacción
    return node;
  });
  
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [isPortalMounted, setIsPortalMounted] = useState(false);
  
  // Para debugging - ahora siempre true para testear
  const [debugMode] = useState(true);
  
  // Referencia para el tooltip
  const tooltipRef = useRef(null);
  // Estado para rastrear si el mouse está sobre el tooltip
  const [isMouseOverTooltip, setIsMouseOverTooltip] = useState(false);

  // Montar el portal en el DOM
  useEffect(() => {
    console.log('🟣 PORTAL: Intentando montar el portal en document.body');
    try {
      // Verificar que document y body existan
      if (!document || !document.body) {
        console.error('🔴 PORTAL ERROR: document o document.body no disponibles');
        return;
      }
      
      document.body.appendChild(portalNode);
      setIsPortalMounted(true);
      
      console.log('🟢 PORTAL: Montado exitosamente en document.body', {
        portalClass: portalNode.className,
        childCount: portalNode.childNodes.length,
        bodyChildCount: document.body.childNodes.length
      });

      // Añadir un ID para facilitar la búsqueda en el inspector
      portalNode.id = `flowchart-tooltip-portal-${Math.random().toString(36).substr(2, 9)}`;
      console.log('🟢 PORTAL ID:', portalNode.id);

      // Limpiar al desmontar
      return () => {
        console.log('🟠 PORTAL: Desmontando portal');
        try {
          document.body.removeChild(portalNode);
          console.log('🟢 PORTAL: Desmontado exitosamente');
        } catch (error) {
          console.error('🔴 PORTAL ERROR: Error al desmontar', error);
        }
        setIsPortalMounted(false);
      };
    } catch (error) {
      console.error('🔴 PORTAL ERROR: Error al montar el portal', error);
      return () => {};
    }
  }, [portalNode]);

  // Actualizar la posición del tooltip cuando cambie targetRef o show
  useEffect(() => {
    if ((show || isMouseOverTooltip) && targetRef?.current) {
      console.log('🟣 PORTAL: Actualizando posición, show=', show, 'mouseOver=', isMouseOverTooltip);
      
      const updatePosition = () => {
        try {
          const rect = targetRef.current.getBoundingClientRect();
          console.log('🟢 PORTAL: getBoundingClientRect', rect);
          
          // Calculamos posición para que esté a la derecha del nodo
          const newPosition = {
            top: rect.top,
            left: rect.right + 15, // 15px de espacio entre nodo y tooltip
          };
          
          // Evitar que el tooltip salga de la pantalla
          const rightEdge = newPosition.left + 260; // Ancho aprox. del tooltip
          if (rightEdge > window.innerWidth) {
            // Si sale por la derecha, lo ponemos a la izquierda del nodo
            newPosition.left = Math.max(10, rect.left - 260 - 15);
          }
          
          console.log('🟢 PORTAL: Nueva posición calculada:', newPosition);
          setPosition(newPosition);
        } catch (error) {
          console.error('🔴 PORTAL ERROR: Error al calcular posición', error);
          // Posición de fallback en caso de error
          setPosition({ top: 100, left: 100 });
        }
      };

      updatePosition();
      
      // Actualizar la posición al hacer scroll o cambiar el tamaño de la ventana
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);

      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [show, isMouseOverTooltip, targetRef]);

  // Actualizar pointer-events del portal cuando se muestre el tooltip
  useEffect(() => {
    if (show || isMouseOverTooltip) {
      console.log('🟢 PORTAL: Habilitando pointer-events');
      portalNode.style.pointerEvents = 'auto'; // Permitir interacción
    } else {
      console.log('🟠 PORTAL: Deshabilitando pointer-events');
      portalNode.style.pointerEvents = 'none'; // Sin interacción
    }
  }, [show, isMouseOverTooltip, portalNode]);

  // Manejadores de eventos para detectar cuando el mouse entra/sale del tooltip
  const handleTooltipMouseEnter = () => {
    console.log('🟢 PORTAL: Mouse entró en tooltip');
    setIsMouseOverTooltip(true);
  };

  const handleTooltipMouseLeave = () => {
    console.log('🟠 PORTAL: Mouse salió de tooltip');
    setIsMouseOverTooltip(false);
  };

  // Log de render
  console.log('🟣 PORTAL: Renderizando portal', { 
    show, 
    isMouseOverTooltip, 
    isPortalMounted,
    shouldRender: show || isMouseOverTooltip,
    position
  });

  // Si no hay que mostrar el tooltip y no está el mouse encima, no renderizamos nada
  if (!show && !isMouseOverTooltip) {
    console.log('🟠 PORTAL: No se renderiza (no show && no mouseOver)');
    return null;
  }

  // Para testing, renderizamos un elemento, aunque el portal no esté montado
  if (!isPortalMounted && debugMode) {
    console.log('🟠 PORTAL: Portal no montado pero debugMode activo - renderizando fallback');
    return (
      <div 
        style={{
          position: 'fixed',
          top: '20px',
          left: '20px',
          width: '200px',
          height: '80px',
          backgroundColor: 'red',
          border: '2px solid black',
          zIndex: 10000,
          padding: '10px',
          color: 'white',
          fontWeight: 'bold'
        }}
      >
        ERROR: Portal no montado
      </div>
    );
  }

  return ReactDOM.createPortal(
    <div 
      ref={tooltipRef}
      className="flowchart-tooltip-container"
      style={{
        position: 'fixed', // Position fixed para posicionamiento absoluto respecto a la ventana
        top: `${position.top}px`,
        left: `${position.left}px`,
        pointerEvents: 'auto',
        // Cuadrado rojo de prueba que se verá siempre mientras estemos en modo debug
        // Ayuda a confirmar que el portal se está montando
        ...(debugMode && !isPortalMounted ? {
          width: '50px',
          height: '50px',
          backgroundColor: 'red',
          border: '2px solid black',
        } : {})
      }}
      onMouseEnter={handleTooltipMouseEnter}
      onMouseLeave={handleTooltipMouseLeave}
    >
      {/* Cuadrado de prueba en modo debug */}
      {debugMode && (
        <div 
          style={{
            position: 'absolute',
            top: -10,
            left: -10,
            width: '20px',
            height: '20px',
            backgroundColor: 'blue',
            zIndex: 10001,
            border: '2px solid white',
            borderRadius: '50%'
          }}
        />
      )}
      
      <FlowchartTooltip 
        show={true} // Siempre mostramos el tooltip si llegamos hasta aquí
        data={data} 
        nodeType={nodeType}
        preview={preview}
        debugInfo={{ isPortalMounted, position }}
      />
    </div>,
    portalNode
  );
};

export default FlowchartTooltipPortal;