import React, { useEffect, useState, useRef } from "react";
import { Stage, Layer, Line, Rect, Circle, Arrow, Text, Group } from "react-konva";
import Konva from "konva";

/**
 * Componente de overlay para dibujo libre usando react-konva
 * Proporciona herramientas avanzadas de dibujo para genograma
 */
function FreeDrawOverlay({ selectedDrawingTool }) {
  const [tool, setTool] = useState(null);
  const [lines, setLines] = useState([]);
  const [rectangles, setRectangles] = useState([]);
  const [circles, setCircles] = useState([]);
  const [arrows, setArrows] = useState([]);
  const [texts, setTexts] = useState([]);
  const [notes, setNotes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  
  const isDrawing = useRef(false);
  const stageRef = useRef(null);
  const containerRef = useRef(null);
  const startPointRef = useRef({ x: 0, y: 0 });
  
  // Sincronizar con el estado de la herramienta seleccionada desde las props
  useEffect(() => {
    setTool(selectedDrawingTool);
    
    // Desseleccionar al cambiar herramientas
    if (selectedDrawingTool !== 'select') {
      setSelectedId(null);
    }
  }, [selectedDrawingTool]);
  
  // Actualizar tamaño del canvas al redimensionar la ventana
  useEffect(() => {
    const checkSize = () => {
      if (!containerRef.current) return;
      
      const width = containerRef.current.offsetWidth;
      const height = containerRef.current.offsetHeight;
      
      if (stageRef.current) {
        stageRef.current.width(width);
        stageRef.current.height(height);
      }
    };
    
    window.addEventListener('resize', checkSize);
    checkSize(); // Comprobar tamaño inicial
    
    return () => window.removeEventListener('resize', checkSize);
  }, []);
  
  // Handler para comenzar a dibujar
  const handleMouseDown = (e) => {
    if (!tool) return;
    
    // Impedir que se propague el evento a React Flow
    e.evt.preventDefault();
    e.evt.stopPropagation();
    
    const pos = e.target.getStage().getPointerPosition();
    startPointRef.current = { x: pos.x, y: pos.y };
    
    switch (tool) {
      case 'select':
        // Funcionamiento de selección
        const clickedOnEmpty = e.target === e.target.getStage();
        if (clickedOnEmpty) {
          setSelectedId(null);
        }
        break;
        
      case 'pen':
        isDrawing.current = true;
        setLines([
          ...lines,
          { points: [pos.x, pos.y], color: '#000000', strokeWidth: 2, id: Date.now() }
        ]);
        break;
        
      case 'rectangle':
        isDrawing.current = true;
        setRectangles([
          ...rectangles,
          {
            x: pos.x,
            y: pos.y,
            width: 0,
            height: 0,
            stroke: '#000000',
            strokeWidth: 2,
            fill: 'transparent',
            id: Date.now()
          }
        ]);
        break;
        
      case 'circle':
        isDrawing.current = true;
        setCircles([
          ...circles,
          {
            x: pos.x,
            y: pos.y,
            radius: 0,
            stroke: '#000000',
            strokeWidth: 2,
            fill: 'transparent',
            id: Date.now()
          }
        ]);
        break;
        
      case 'arrow':
        isDrawing.current = true;
        setArrows([
          ...arrows,
          {
            points: [pos.x, pos.y, pos.x, pos.y],
            stroke: '#000000',
            strokeWidth: 2,
            fill: '#000000',
            id: Date.now()
          }
        ]);
        break;
        
      case 'text':
        const text = window.prompt('Ingrese el texto:', '');
        if (text) {
          setTexts([
            ...texts,
            {
              x: pos.x,
              y: pos.y,
              text: text,
              fontSize: 16,
              fill: '#000000',
              id: Date.now()
            }
          ]);
        }
        break;
        
      case 'note':
        const noteText = window.prompt('Nota:', '');
        if (noteText) {
          setNotes([
            ...notes,
            {
              x: pos.x,
              y: pos.y,
              width: 150,
              height: 100,
              text: noteText,
              fill: '#FFFF88',
              stroke: '#E6C000',
              id: Date.now()
            }
          ]);
        }
        break;
        
      default:
        break;
    }
  };
  
  // Handler para continuar dibujando
  const handleMouseMove = (e) => {
    if (!isDrawing.current || !tool) return;
    
    // Impedir que se propague el evento a React Flow
    e.evt.preventDefault();
    e.evt.stopPropagation();
    
    const pos = e.target.getStage().getPointerPosition();
    
    switch (tool) {
      case 'pen':
        let lastLine = lines[lines.length - 1];
        lastLine.points = lastLine.points.concat([pos.x, pos.y]);
        
        setLines([...lines.slice(0, -1), lastLine]);
        break;
        
      case 'rectangle':
        let lastRect = rectangles[rectangles.length - 1];
        const newRectWidth = pos.x - startPointRef.current.x;
        const newRectHeight = pos.y - startPointRef.current.y;
        
        lastRect = {
          ...lastRect,
          width: newRectWidth,
          height: newRectHeight
        };
        
        setRectangles([...rectangles.slice(0, -1), lastRect]);
        break;
        
      case 'circle':
        let lastCircle = circles[circles.length - 1];
        const dx = pos.x - startPointRef.current.x;
        const dy = pos.y - startPointRef.current.y;
        const radius = Math.sqrt(dx * dx + dy * dy);
        
        lastCircle = {
          ...lastCircle,
          radius: radius
        };
        
        setCircles([...circles.slice(0, -1), lastCircle]);
        break;
        
      case 'arrow':
        let lastArrow = arrows[arrows.length - 1];
        
        lastArrow = {
          ...lastArrow,
          points: [lastArrow.points[0], lastArrow.points[1], pos.x, pos.y]
        };
        
        setArrows([...arrows.slice(0, -1), lastArrow]);
        break;
        
      default:
        break;
    }
  };
  
  // Handler para terminar dibujo
  const handleMouseUp = (e) => {
    if (!isDrawing.current) return;
    
    isDrawing.current = false;
    
    // Validar que la forma tenga tamaño mínimo y eliminar si es muy pequeña
    if (tool === 'rectangle') {
      const lastRect = rectangles[rectangles.length - 1];
      if (Math.abs(lastRect.width) < 5 || Math.abs(lastRect.height) < 5) {
        setRectangles(rectangles.slice(0, -1));
      }
    } else if (tool === 'circle') {
      const lastCircle = circles[circles.length - 1];
      if (lastCircle.radius < 5) {
        setCircles(circles.slice(0, -1));
      }
    } else if (tool === 'arrow') {
      const lastArrow = arrows[arrows.length - 1];
      const points = lastArrow.points;
      const dx = points[2] - points[0];
      const dy = points[3] - points[1];
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 5) {
        setArrows(arrows.slice(0, -1));
      }
    } else if (tool === 'pen') {
      const lastLine = lines[lines.length - 1];
      if (lastLine.points.length < 6) { // Menos de 3 puntos
        setLines(lines.slice(0, -1));
      }
    }
  };

  // Obtener cursor según la herramienta seleccionada
  const getCursor = () => {
    switch (tool) {
      case 'line':
      case 'rectangle':
      case 'circle':
      case 'arrow': return 'crosshair';
      case 'text': return 'text';
      case 'pen': return 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\'%3E%3Cpath fill=\'none\' stroke=\'%23000\' stroke-width=\'2\' d=\'M15 3l6 6L9 21H3v-6L15 3z\'/%3E%3C/svg%3E") 0 24, auto';
      case 'note': return 'copy';
      case 'select': return 'default';
      default: return 'default';
    }
  };
  
  // Eliminar una forma
  const handleDeleteShape = () => {
    if (!selectedId) return;
    
    if (window.confirm('¿Estás seguro de que deseas eliminar esta forma?')) {
      setLines(lines.filter(line => line.id !== selectedId));
      setRectangles(rectangles.filter(rect => rect.id !== selectedId));
      setCircles(circles.filter(circle => circle.id !== selectedId));
      setArrows(arrows.filter(arrow => arrow.id !== selectedId));
      setTexts(texts.filter(text => text.id !== selectedId));
      setNotes(notes.filter(note => note.id !== selectedId));
      setSelectedId(null);
    }
  };
  
  // Manejar teclas (para eliminar formas)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.keyCode === 8 || e.keyCode === 46) && selectedId) {
        // Delete o Backspace
        handleDeleteShape();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedId, lines, rectangles, circles, arrows, texts, notes]);

  // Si no hay herramienta seleccionada, no mostrar el overlay
  if (!tool) return null;
  
  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 10,
        cursor: getCursor(),
      }}
    >
      <Stage
        ref={stageRef}
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <Layer>
          {/* Dibujar líneas (trazo libre) */}
          {lines.map((line) => (
            <Line
              key={line.id}
              points={line.points}
              stroke={line.color}
              strokeWidth={line.strokeWidth}
              tension={0.5}
              lineCap="round"
              lineJoin="round"
              onClick={() => tool === 'select' && setSelectedId(line.id)}
              onTap={() => tool === 'select' && setSelectedId(line.id)}
              perfectDrawEnabled={false}
              shadowForStrokeEnabled={false}
              hitStrokeWidth={tool === 'select' ? 10 : 0}
              {...(selectedId === line.id && {
                shadowColor: 'blue',
                shadowBlur: 10,
                shadowOpacity: 0.6,
              })}
            />
          ))}
          
          {/* Dibujar rectángulos */}
          {rectangles.map((rect) => (
            <Rect
              key={rect.id}
              x={rect.width < 0 ? rect.x + rect.width : rect.x}
              y={rect.height < 0 ? rect.y + rect.height : rect.y}
              width={Math.abs(rect.width)}
              height={Math.abs(rect.height)}
              stroke={rect.stroke}
              strokeWidth={rect.strokeWidth}
              fill={rect.fill}
              onClick={() => tool === 'select' && setSelectedId(rect.id)}
              onTap={() => tool === 'select' && setSelectedId(rect.id)}
              draggable={tool === 'select'}
              onDragEnd={(e) => {
                // Actualizar posición al arrastrar
                const rects = [...rectangles];
                const index = rects.findIndex(r => r.id === rect.id);
                if (index >= 0) {
                  const updatedRect = {
                    ...rects[index],
                    x: e.target.x(),
                    y: e.target.y()
                  };
                  rects[index] = updatedRect;
                  setRectangles(rects);
                }
              }}
              {...(selectedId === rect.id && {
                shadowColor: 'blue',
                shadowBlur: 10,
                shadowOpacity: 0.6,
              })}
            />
          ))}
          
          {/* Dibujar círculos */}
          {circles.map((circle) => (
            <Circle
              key={circle.id}
              x={circle.x}
              y={circle.y}
              radius={circle.radius}
              stroke={circle.stroke}
              strokeWidth={circle.strokeWidth}
              fill={circle.fill}
              onClick={() => tool === 'select' && setSelectedId(circle.id)}
              onTap={() => tool === 'select' && setSelectedId(circle.id)}
              draggable={tool === 'select'}
              onDragEnd={(e) => {
                // Actualizar posición al arrastrar
                const circs = [...circles];
                const index = circs.findIndex(c => c.id === circle.id);
                if (index >= 0) {
                  const updatedCircle = {
                    ...circs[index],
                    x: e.target.x(),
                    y: e.target.y()
                  };
                  circs[index] = updatedCircle;
                  setCircles(circs);
                }
              }}
              {...(selectedId === circle.id && {
                shadowColor: 'blue',
                shadowBlur: 10,
                shadowOpacity: 0.6,
              })}
            />
          ))}
          
          {/* Dibujar flechas */}
          {arrows.map((arrow) => (
            <Arrow
              key={arrow.id}
              points={arrow.points}
              stroke={arrow.stroke}
              strokeWidth={arrow.strokeWidth}
              fill={arrow.fill}
              pointerLength={10}
              pointerWidth={10}
              onClick={() => tool === 'select' && setSelectedId(arrow.id)}
              onTap={() => tool === 'select' && setSelectedId(arrow.id)}
              draggable={tool === 'select'}
              onDragEnd={(e) => {
                // Actualizar posición al arrastrar
                const arrs = [...arrows];
                const index = arrs.findIndex(a => a.id === arrow.id);
                if (index >= 0) {
                  const dx = e.target.x();
                  const dy = e.target.y();
                  const newPoints = [
                    arrow.points[0] + dx,
                    arrow.points[1] + dy,
                    arrow.points[2] + dx,
                    arrow.points[3] + dy
                  ];
                  const updatedArrow = {
                    ...arrs[index],
                    points: newPoints
                  };
                  arrs[index] = updatedArrow;
                  setArrows(arrs);
                }
              }}
              {...(selectedId === arrow.id && {
                shadowColor: 'blue',
                shadowBlur: 10,
                shadowOpacity: 0.6,
              })}
            />
          ))}
          
          {/* Dibujar textos */}
          {texts.map((text) => (
            <Text
              key={text.id}
              x={text.x}
              y={text.y}
              text={text.text}
              fontSize={text.fontSize}
              fill={text.fill}
              onClick={() => tool === 'select' && setSelectedId(text.id)}
              onTap={() => tool === 'select' && setSelectedId(text.id)}
              draggable={tool === 'select'}
              onDragEnd={(e) => {
                // Actualizar posición al arrastrar
                const txts = [...texts];
                const index = txts.findIndex(t => t.id === text.id);
                if (index >= 0) {
                  const updatedText = {
                    ...txts[index],
                    x: e.target.x(),
                    y: e.target.y()
                  };
                  txts[index] = updatedText;
                  setTexts(txts);
                }
              }}
              onDblClick={() => {
                if (tool === 'select') {
                  const newText = window.prompt('Editar texto:', text.text);
                  if (newText !== null) {
                    const txts = [...texts];
                    const index = txts.findIndex(t => t.id === text.id);
                    if (index >= 0) {
                      txts[index] = { ...txts[index], text: newText };
                      setTexts(txts);
                    }
                  }
                }
              }}
              {...(selectedId === text.id && {
                shadowColor: 'blue',
                shadowBlur: 10,
                shadowOpacity: 0.6,
              })}
            />
          ))}
          
          {/* Dibujar notas adhesivas */}
          {notes.map((note) => (
            <Group
              key={note.id}
              draggable={tool === 'select'}
              onClick={() => tool === 'select' && setSelectedId(note.id)}
              onTap={() => tool === 'select' && setSelectedId(note.id)}
              onDragEnd={(e) => {
                // Actualizar posición al arrastrar
                const nts = [...notes];
                const index = nts.findIndex(n => n.id === note.id);
                if (index >= 0) {
                  const updatedNote = {
                    ...nts[index],
                    x: e.target.x(),
                    y: e.target.y()
                  };
                  nts[index] = updatedNote;
                  setNotes(nts);
                }
              }}
              onDblClick={() => {
                if (tool === 'select') {
                  const newText = window.prompt('Editar nota:', note.text);
                  if (newText !== null) {
                    const nts = [...notes];
                    const index = nts.findIndex(n => n.id === note.id);
                    if (index >= 0) {
                      nts[index] = { ...nts[index], text: newText };
                      setNotes(nts);
                    }
                  }
                }
              }}
              {...(selectedId === note.id && {
                shadowColor: 'blue',
                shadowBlur: 10,
                shadowOpacity: 0.6,
              })}
            >
              <Rect
                x={note.x}
                y={note.y}
                width={note.width}
                height={note.height}
                fill={note.fill}
                stroke={note.stroke}
                strokeWidth={1}
                cornerRadius={5}
              />
              <Text
                x={note.x + 10}
                y={note.y + 10}
                text={note.text}
                fontSize={12}
                fill="#000000"
                width={note.width - 20}
                wrap="word"
                ellipsis={true}
              />
            </Group>
          ))}
        </Layer>
      </Stage>
    </div>
  );
}

export default FreeDrawOverlay;