import React, { useMemo } from 'react';
import { useViewport } from 'reactflow';

/**
 * Componente para visualizar las guías inteligentes al estilo LucidChart mientras se arrastran nodos
 */
function SmartGuidesOverlay({ guides, showDistances }) {
  // Obtener información del viewport de ReactFlow
  const { x: offsetX, y: offsetY, zoom } = useViewport();
  
  // Transformar los puntos para que coincidan con el zoom y desplazamiento actual del lienzo
  const transformedGuides = useMemo(() => {
    return {
      horizontal: guides.horizontal.map(guide => ({
        ...guide,
        pos: guide.pos * zoom + offsetY,
        start: guide.start * zoom + offsetX,
        end: guide.end * zoom + offsetX
      })),
      vertical: guides.vertical.map(guide => ({
        ...guide,
        pos: guide.pos * zoom + offsetX,
        start: guide.start * zoom + offsetY,
        end: guide.end * zoom + offsetY
      })),
      distances: guides.distances || [] // Guía de distribución equidistante (opcional)
    };
  }, [guides, offsetX, offsetY, zoom]);
  
  // Estilo para las líneas guía
  const guidesStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    pointerEvents: 'none',
    zIndex: 1000
  };
  
  // Estilo para los textos de distancia
  const distanceTextStyle = {
    position: 'absolute',
    backgroundColor: 'rgba(0, 120, 255, 0.8)',
    color: '#ffffff',
    fontSize: '10px',
    padding: '2px 4px',
    borderRadius: '2px',
    pointerEvents: 'none',
    zIndex: 1001,
    fontFamily: 'Arial, sans-serif',
    boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
  };
  
  // Colores para diferentes tipos de guías (estilo Lucidchart)
  const guideColors = {
    center: 'rgba(0, 120, 255, 0.9)',  // Azul brillante para líneas centrales
    edge: 'rgba(64, 115, 255, 0.7)',   // Azul más claro para bordes
    spacing: 'rgba(255, 153, 0, 0.8)',  // Naranja para guías de espaciado
    distribution: 'rgba(230, 0, 115, 0.7)' // Magenta para distribución equidistante
  };
  
  return (
    <div style={guidesStyle}>
      {/* Líneas guía horizontales */}
      {transformedGuides.horizontal.map((guide, index) => {
        const isCenter = guide.type.includes('center');
        const isSpacing = guide.isSpacing;
        const lineColor = isSpacing ? guideColors.spacing : (isCenter ? guideColors.center : guideColors.edge);
        
        return (
          <React.Fragment key={`h-${index}`}>
            {/* Línea guía principal */}
            <div 
              style={{
                position: 'absolute',
                height: '1px',
                width: `${guide.end - guide.start}px`,
                left: `${guide.start}px`,
                top: `${guide.pos}px`,
                backgroundColor: lineColor,
                borderTop: isCenter 
                  ? `1px solid ${lineColor}` 
                  : (isSpacing ? `1px dashed ${lineColor}` : `1px dotted ${lineColor}`),
                boxShadow: isCenter ? '0 0 2px rgba(0, 120, 255, 0.5)' : 'none'
              }}
            />
            
            {/* Marcadores de extremos para líneas centrales */}
            {isCenter && (
              <>
                <div 
                  style={{
                    position: 'absolute',
                    height: '7px',
                    width: '1px',
                    left: `${guide.start}px`,
                    top: `${guide.pos - 3}px`,
                    backgroundColor: lineColor,
                  }}
                />
                <div 
                  style={{
                    position: 'absolute',
                    height: '7px',
                    width: '1px',
                    left: `${guide.end}px`,
                    top: `${guide.pos - 3}px`,
                    backgroundColor: lineColor,
                  }}
                />
              </>
            )}
            
            {/* Texto de distancia para guías horizontales */}
            {showDistances && (
              <div
                style={{
                  ...distanceTextStyle,
                  left: `${(guide.start + guide.end) / 2}px`,
                  top: `${guide.pos - 16}px`,
                  transform: 'translateX(-50%)',
                  backgroundColor: isSpacing ? guideColors.spacing : guideColors.center,
                }}
              >
                {isSpacing 
                  ? `Espacio: ${Math.round(Math.abs(guide.distance))}px` 
                  : `Y: ${Math.round(guide.pos / zoom - offsetY)}px`}
              </div>
            )}
          </React.Fragment>
        );
      })}
      
      {/* Líneas guía verticales */}
      {transformedGuides.vertical.map((guide, index) => {
        const isCenter = guide.type.includes('center');
        const isSpacing = guide.isSpacing;
        const lineColor = isSpacing ? guideColors.spacing : (isCenter ? guideColors.center : guideColors.edge);
        
        return (
          <React.Fragment key={`v-${index}`}>
            {/* Línea guía principal */}
            <div 
              style={{
                position: 'absolute',
                width: '1px',
                height: `${guide.end - guide.start}px`,
                left: `${guide.pos}px`,
                top: `${guide.start}px`,
                backgroundColor: lineColor,
                borderLeft: isCenter 
                  ? `1px solid ${lineColor}` 
                  : (isSpacing ? `1px dashed ${lineColor}` : `1px dotted ${lineColor}`),
                boxShadow: isCenter ? '0 0 2px rgba(0, 120, 255, 0.5)' : 'none'
              }}
            />
            
            {/* Marcadores de extremos para líneas centrales */}
            {isCenter && (
              <>
                <div 
                  style={{
                    position: 'absolute',
                    width: '7px',
                    height: '1px',
                    left: `${guide.pos - 3}px`,
                    top: `${guide.start}px`,
                    backgroundColor: lineColor,
                  }}
                />
                <div 
                  style={{
                    position: 'absolute',
                    width: '7px',
                    height: '1px',
                    left: `${guide.pos - 3}px`,
                    top: `${guide.end}px`,
                    backgroundColor: lineColor,
                  }}
                />
              </>
            )}
            
            {/* Texto de distancia para guías verticales */}
            {showDistances && (
              <div
                style={{
                  ...distanceTextStyle,
                  left: `${guide.pos - 20}px`,
                  top: `${(guide.start + guide.end) / 2}px`,
                  transform: 'translateY(-50%)',
                  backgroundColor: isSpacing ? guideColors.spacing : guideColors.center,
                  whiteSpace: 'nowrap',
                }}
              >
                {isSpacing 
                  ? `Espacio: ${Math.round(Math.abs(guide.distance))}px` 
                  : `X: ${Math.round(guide.pos / zoom - offsetX)}px`}
              </div>
            )}
          </React.Fragment>
        );
      })}
      
      {/* Guías de distribución equidistante (característica adicional de Lucidchart) */}
      {transformedGuides.distances && transformedGuides.distances.map((distGuide, index) => {
        if (!distGuide) return null;
        const { positions, axis, average } = distGuide;
        if (!positions || positions.length < 3) return null;
        
        return (
          <React.Fragment key={`dist-${index}`}>
            {/* Línea de distribución equidistante */}
            {axis === 'x' ? (
              // Línea horizontal para distribución vertical
              <div
                style={{
                  position: 'absolute',
                  height: '1px',
                  width: `${positions[positions.length-1] - positions[0]}px`,
                  left: `${positions[0]}px`,
                  top: `${average}px`,
                  borderTop: `1px dashed ${guideColors.distribution}`,
                }}
              />
            ) : (
              // Línea vertical para distribución horizontal
              <div
                style={{
                  position: 'absolute',
                  width: '1px',
                  height: `${positions[positions.length-1] - positions[0]}px`,
                  left: `${average}px`,
                  top: `${positions[0]}px`,
                  borderLeft: `1px dashed ${guideColors.distribution}`,
                }}
              />
            )}
            
            {/* Indicadores de distribución equidistante */}
            {positions.map((pos, idx) => (
              <div
                key={`dist-marker-${idx}`}
                style={{
                  position: 'absolute',
                  width: axis === 'x' ? '1px' : '7px',
                  height: axis === 'x' ? '7px' : '1px',
                  left: axis === 'x' ? `${pos}px` : `${average - 3}px`,
                  top: axis === 'x' ? `${average - 3}px` : `${pos}px`,
                  backgroundColor: guideColors.distribution,
                }}
              />
            ))}
            
            {/* Etiqueta de distribución equidistante */}
            {showDistances && (
              <div
                style={{
                  ...distanceTextStyle,
                  backgroundColor: guideColors.distribution,
                  left: axis === 'y' ? `${average - 40}px` : `${(positions[0] + positions[positions.length-1]) / 2}px`,
                  top: axis === 'y' ? `${(positions[0] + positions[positions.length-1]) / 2}px` : `${average - 20}px`,
                  transform: axis === 'y' ? 'translateY(-50%)' : 'translateX(-50%)',
                }}
              >
                Distribución equidistante
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default SmartGuidesOverlay;