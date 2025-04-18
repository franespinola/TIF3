import React, { useEffect, useState, useRef } from "react";
import { useViewport, useReactFlow } from 'reactflow';
import { Stage, Layer, Line, Rect, Circle, Arrow, Text, Group } from "react-konva";

/**
 * Overlay de dibujo libre para React Flow + Konva
 */
function FreeDrawOverlay({ 
  selectedDrawingTool: tool, 
  drawingColor, 
  strokeWidth, 
  nodes: rfNodes, 
  setNodes: setRfNodes, 
  edges: rfEdges, 
  setEdges: setRfEdges 
}) {
  // 1) Leemos panX, panY y zoom
  const { x: panX, y: panY, zoom } = useViewport();
  // 2) Obtenemos setViewport para actualizar el zoom
  const { setViewport, getNodes, getEdges } = useReactFlow();

  const [lines, setLines] = useState([]);
  const [rectangles, setRectangles] = useState([]);
  const [circles, setCircles] = useState([]);
  const [arrows, setArrows] = useState([]);
  const [texts, setTexts] = useState([]);
  const [notes, setNotes] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectionRect, setSelectionRect] = useState(null);
  const isSelecting = useRef(false);
  const startSelRect = useRef({ x: 0, y: 0 });

  const isDrawing = useRef(false);
  const stageRef = useRef(null);
  const containerRef = useRef(null);
  const startPointRef = useRef({ x: 0, y: 0 });

  // Deseleccionar al cambiar herramienta
  useEffect(() => {
    setSelectedIds([]);
    setRfNodes(nds => nds.map(n => ({ ...n, selected: false })));
    setRfEdges(eds => eds.map(e => ({ ...e, selected: false })));
  }, [tool, setRfNodes, setRfEdges]);

  // Ajustar tamaño del Stage al contenedor
  useEffect(() => {
    const resize = () => {
      if (!containerRef.current || !stageRef.current) return;
      stageRef.current.width(containerRef.current.offsetWidth);
      stageRef.current.height(containerRef.current.offsetHeight);
    };
    window.addEventListener('resize', resize);
    resize();
    return () => window.removeEventListener('resize', resize);
  }, []);

  // Tecla Supr / Retroceso para borrar
  useEffect(() => {
    const onKey = e => {
      if ((e.key === 'Delete' || e.key === 'Backspace')) {
        if (selectedIds.length) {
          setLines(ls => ls.filter(l => !selectedIds.includes(l.id)));
          setRectangles(rs => rs.filter(r => !selectedIds.includes(r.id)));
          setCircles(cs => cs.filter(c => !selectedIds.includes(c.id)));
          setArrows(as => as.filter(a => !selectedIds.includes(a.id)));
          setTexts(ts => ts.filter(t => !selectedIds.includes(t.id)));
          setNotes(ns => ns.filter(n => !selectedIds.includes(n.id)));
          setSelectedIds([]);
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedIds, lines, rectangles, circles, arrows, texts, notes, rfNodes, setRfNodes, rfEdges, setRfEdges]);

  // 3) Manejador de rueda para zoom
  const handleWheel = e => {
    e.preventDefault();
    const rect = containerRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    const delta = -e.deltaY * 0.001;
    const newZoom = Math.min(4, Math.max(0.1, zoom + delta));
    const graphX = (offsetX - panX) / zoom;
    const graphY = (offsetY - panY) / zoom;
    const newPanX = offsetX - graphX * newZoom;
    const newPanY = offsetY - graphY * newZoom;
    setViewport({ x: newPanX, y: newPanY, zoom: newZoom });
  };

  // Inicia dibujo
  const handleMouseDown = e => {
    if (!tool) return;
    if (tool === 'select' && e.target === e.target.getStage()) {
      const pos = e.target.getStage().getPointerPosition();
      isSelecting.current = true;
      startSelRect.current = pos;
      setSelectionRect({ x: pos.x, y: pos.y, width: 0, height: 0 });
      setSelectedIds([]);
      setRfNodes(nds => nds.map(n => ({ ...n, selected: false })));
      setRfEdges(eds => eds.map(e => ({ ...e, selected: false })));
      return;
    }
    e.evt.preventDefault(); e.evt.stopPropagation();
    const pos = e.target.getStage().getPointerPosition();
    const graphX = (pos.x - panX) / zoom;
    const graphY = (pos.y - panY) / zoom;
    startPointRef.current = { x: graphX, y: graphY };

    switch (tool) {
      case 'select':
        if (e.target === e.target.getStage()) setSelectedIds([]);
        break;
      case 'pen':
      case 'eraser':
        isDrawing.current = true;
        setLines(ls => [...ls, {
          points: [graphX, graphY],
          color: drawingColor,
          strokeWidth,
          isEraser: tool === 'eraser',
          id: Date.now()
        }]);
        break;
      case 'rectangle':
        isDrawing.current = true;
        setRectangles(rs => [...rs, {
          x: graphX, y: graphY,
          width: 0, height: 0,
          stroke: '#000', strokeWidth: 2,
          fill: 'transparent', id: Date.now()
        }]);
        break;
      case 'circle':
        isDrawing.current = true;
        setCircles(cs => [...cs, {
          x: graphX, y: graphY,
          radius: 0,
          stroke: '#000', strokeWidth: 2,
          fill: 'transparent', id: Date.now()
        }]);
        break;
      case 'arrow':
        isDrawing.current = true;
        setArrows(as => [...as, {
          points: [graphX, graphY, graphX, graphY],
          stroke: '#000', strokeWidth: 2, fill: '#000',
          id: Date.now()
        }]);
        break;
      case 'text':
        const t = window.prompt('Ingrese el texto:', '');
        if (t) setTexts(ts => [...ts, { x: graphX, y: graphY, text: t, fontSize: 16, fill: '#000', id: Date.now() }]);
        break;
      case 'note':
        const n = window.prompt('Nota:', '');
        if (n) setNotes(ns => [...ns, {
          x: graphX, y: graphY,
          width: 150, height: 100,
          text: n,
          fill: '#FFFF88', stroke: '#E6C000',
          id: Date.now()
        }]);
        break;
      default:
        break;
    }
  };

  // Continúa dibujo
  const handleMouseMove = e => {
    if (isSelecting.current && tool === 'select') {
      const pos = e.target.getStage().getPointerPosition();
      const x = Math.min(startSelRect.current.x, pos.x);
      const y = Math.min(startSelRect.current.y, pos.y);
      const width = Math.abs(pos.x - startSelRect.current.x);
      const height = Math.abs(pos.y - startSelRect.current.y);
      setSelectionRect({ x, y, width, height });
      return;
    }
    if (!isDrawing.current || !tool) return;
    e.evt.preventDefault(); e.evt.stopPropagation();
    const pos = e.target.getStage().getPointerPosition();
    const graphX = (pos.x - panX) / zoom;
    const graphY = (pos.y - panY) / zoom;

    if (tool === 'pen' || tool === 'eraser') {
      setLines(ls => {
        const last = { ...ls[ls.length - 1] };
        last.points = last.points.concat([graphX, graphY]);
        return [...ls.slice(0, -1), last];
      });
    }
    if (tool === 'rectangle') {
      setRectangles(rs => {
        const last = { ...rs[rs.length - 1] };
        last.width = graphX - startPointRef.current.x;
        last.height = graphY - startPointRef.current.y;
        return [...rs.slice(0, -1), last];
      });
    }
    if (tool === 'circle') {
      setCircles(cs => {
        const last = { ...cs[cs.length - 1] };
        const dx = graphX - startPointRef.current.x;
        const dy = graphY - startPointRef.current.y;
        last.radius = Math.hypot(dx, dy);
        return [...cs.slice(0, -1), last];
      });
    }
    if (tool === 'arrow') {
      setArrows(as => {
        const last = { ...as[as.length - 1] };
        last.points = [last.points[0], last.points[1], graphX, graphY];
        return [...as.slice(0, -1), last];
      });
    }
  };

  // Termina dibujo
  const handleMouseUp = () => {
    if (isSelecting.current) {
      isSelecting.current = false;
      if (!selectionRect || selectionRect.width < 3 || selectionRect.height < 3) {
         setSelectionRect(null);
         setSelectedIds([]);
         return;
      }

      const { x, y, width, height } = selectionRect;
      const graphRect = {
        x1: (x - panX) / zoom,
        y1: (y - panY) / zoom,
        x2: ((x + width) - panX) / zoom,
        y2: ((y + height) - panY) / zoom,
      };
      const selectionGraphBounds = {
        minX: Math.min(graphRect.x1, graphRect.x2),
        maxX: Math.max(graphRect.x1, graphRect.x2),
        minY: Math.min(graphRect.y1, graphRect.y2),
        maxY: Math.max(graphRect.y1, graphRect.y2),
      };

      const intersects = (shapeBounds) => {
        return !(
          selectionGraphBounds.maxX < shapeBounds.minX ||
          selectionGraphBounds.minX > shapeBounds.maxX ||
          selectionGraphBounds.maxY < shapeBounds.minY ||
          selectionGraphBounds.minY > shapeBounds.maxY
        );
      };

      const konvaIds = [];
      rectangles.forEach(r => {
        const shapeBounds = {
          minX: r.width < 0 ? r.x + r.width : r.x,
          maxX: r.width < 0 ? r.x : r.x + r.width,
          minY: r.height < 0 ? r.y + r.height : r.y,
          maxY: r.height < 0 ? r.y : r.y + r.height,
        };
        if (intersects(shapeBounds)) konvaIds.push(r.id);
      });

      circles.forEach(c => {
         const shapeBounds = {
           minX: c.x - c.radius,
           maxX: c.x + c.radius,
           minY: c.y - c.radius,
           maxY: c.y + c.radius,
         };
        if (intersects(shapeBounds)) konvaIds.push(c.id);
      });

      arrows.forEach(a => {
        const [x0,y0,x1p,y1p] = a.points;
         const shapeBounds = {
           minX: Math.min(x0, x1p),
           maxX: Math.max(x0, x1p),
           minY: Math.min(y0, y1p),
           maxY: Math.max(y0, y1p),
         };
        if (intersects(shapeBounds)) konvaIds.push(a.id);
      });

      texts.forEach(t => {
        if (t.x >= selectionGraphBounds.minX && t.x <= selectionGraphBounds.maxX &&
            t.y >= selectionGraphBounds.minY && t.y <= selectionGraphBounds.maxY) {
          konvaIds.push(t.id);
        }
      });

      notes.forEach(n => {
         const shapeBounds = {
           minX: n.x,
           maxX: n.x + n.width,
           minY: n.y,
           maxY: n.y + n.height,
         };
        if (intersects(shapeBounds)) konvaIds.push(n.id);
      });

      lines.forEach(l => {
        for (let i=0; i<l.points.length; i+=2) {
          const px = l.points[i], py = l.points[i+1];
          if (px >= selectionGraphBounds.minX && px <= selectionGraphBounds.maxX &&
              py >= selectionGraphBounds.minY && py <= selectionGraphBounds.maxY) {
            konvaIds.push(l.id);
            break;
          }
        }
      });

      setSelectedIds(Array.from(new Set(konvaIds)));

      const reactFlowNodes = getNodes();
      const selectedNodeIds = new Set();
      reactFlowNodes.forEach(node => {
        if (!node.width || !node.height) return;
        const nodeBounds = {
          minX: node.position.x,
          maxX: node.position.x + node.width,
          minY: node.position.y,
          maxY: node.position.y + node.height,
        };
        if (intersects(nodeBounds)) {
          selectedNodeIds.add(node.id);
        }
      });

      const reactFlowEdges = getEdges();
      const selectedEdgeIds = new Set();
      reactFlowEdges.forEach(edge => {
        if (selectedNodeIds.has(edge.source) && selectedNodeIds.has(edge.target)) {
          selectedEdgeIds.add(edge.id);
        }
      });

      setRfNodes(nds => 
        nds.map(n => ({ ...n, selected: selectedNodeIds.has(n.id) }))
      );
      setRfEdges(eds => 
        eds.map(e => ({ ...e, selected: selectedEdgeIds.has(e.id) }))
      );

      setSelectionRect(null);
      isSelecting.current = false;
      return;
    }

    if (!isDrawing.current) return;
    isDrawing.current = false;
    const clean = (arr, fn) => fn(arr[arr.length - 1]) ? arr.slice(0, -1) : arr;
    if (tool === 'pen' || tool === 'eraser') setLines(ls => clean(ls, l => l.points.length < 6));
    if (tool === 'rectangle') setRectangles(rs => clean(rs, r => Math.abs(r.width) < 5 && Math.abs(r.height) < 5));
    if (tool === 'circle') setCircles(cs => clean(cs, c => c.radius < 5));
    if (tool === 'arrow') setArrows(as => clean(as, a => {
      const [x0, y0, x1, y1] = a.points;
      return Math.hypot(x1 - x0, y1 - y0) < 5;
    }));
  };

  // Determina cursor
  const getCursor = () => {
    switch (tool) {
      case 'rectangle': case 'circle': case 'arrow': return 'crosshair';
      case 'text': return 'text';
      case 'pen': return 'crosshair';
      case 'note': return 'copy';
      default: return 'default';
    }
  };

  // Borra la forma seleccionada
  function handleDeleteShape() {
    setLines(ls => ls.filter(l => !selectedIds.includes(l.id)));
    setRectangles(rs => rs.filter(r => !selectedIds.includes(r.id)));
    setCircles(cs => cs.filter(c => !selectedIds.includes(c.id)));
    setArrows(as => as.filter(a => !selectedIds.includes(a.id)));
    setTexts(ts => ts.filter(t => !selectedIds.includes(t.id)));
    setNotes(ns => ns.filter(n => !selectedIds.includes(n.id)));
    setSelectedIds([]);
  }

  // Toggle selection for a shape (Ctrl+click for multi, click for single)
  const handleSelectShape = (id, ctrl) => {
    if (!ctrl) {
      setSelectedIds([id]);
    } else {
      setSelectedIds(sids => sids.includes(id) ? sids.filter(x => x !== id) : [...sids, id]);
    }
  };

  return (
    <div
      ref={containerRef}
      onWheel={tool ? handleWheel : undefined}
      style={{
        position: 'absolute',
        top: 0, left: 0,
        width: '100%', height: '100%',
        zIndex: 10,
        cursor: getCursor(),
        pointerEvents: tool ? 'auto' : 'none',
      }}
    >
      <Stage
        ref={stageRef}
        width={containerRef.current?.offsetWidth || window.innerWidth}
        height={containerRef.current?.offsetHeight || window.innerHeight}
        onMouseDown={tool ? handleMouseDown : undefined}
        onMouseMove={tool ? handleMouseMove : undefined}
        onMouseUp={tool ? handleMouseUp : undefined}
        onMouseLeave={tool ? handleMouseUp : undefined}
      >
        <Layer>
          <Group x={panX} y={panY} scaleX={zoom} scaleY={zoom}>
            {rectangles.map(r => (
              <Rect
                key={r.id}
                x={r.width < 0 ? r.x + r.width : r.x}
                y={r.height < 0 ? r.y + r.height : r.y}
                width={Math.abs(r.width)}
                height={Math.abs(r.height)}
                stroke={r.stroke}
                strokeWidth={r.strokeWidth}
                fill={r.fill}
                draggable={tool === 'select'}
                onClick={e => tool === 'select' && handleSelectShape(r.id, e.evt.ctrlKey)}
                onDragEnd={e => {
                  const updated = { ...r, x: e.target.x(), y: e.target.y() };
                  setRectangles(rs => rs.map(rr => rr.id === r.id ? updated : rr));
                }}
                {...(selectedIds.includes(r.id) && { shadowColor: '#A9A9A9', shadowBlur: 10, shadowOpacity: 0.8 })}
              />
            ))}
            {circles.map(c => (
              <Circle
                key={c.id}
                x={c.x}
                y={c.y}
                radius={c.radius}
                stroke={c.stroke}
                strokeWidth={c.strokeWidth}
                fill={c.fill}
                draggable={tool === 'select'}
                onClick={e => tool === 'select' && handleSelectShape(c.id, e.evt.ctrlKey)}
                onDragEnd={e => {
                  const updated = { ...c, x: e.target.x(), y: e.target.y() };
                  setCircles(cs => cs.map(cc => cc.id === c.id ? updated : cc));
                }}
                {...(selectedIds.includes(c.id) && { shadowColor: '#A9A9A9', shadowBlur: 10, shadowOpacity: 0.8 })}
              />
            ))}
            {arrows.map(a => (
              <Arrow
                key={a.id}
                points={a.points}
                stroke={a.stroke}
                strokeWidth={a.strokeWidth}
                fill={a.fill}
                pointerLength={10}
                pointerWidth={10}
                draggable={tool === 'select'}
                onClick={e => tool === 'select' && handleSelectShape(a.id, e.evt.ctrlKey)}
                onDragEnd={e => {
                  const dx = e.target.x(), dy = e.target.y();
                  const [x0,y0,x1,y1] = a.points;
                  const updated = { ...a, points: [x0+dx, y0+dy, x1+dx, y1+dy] };
                  setArrows(as => as.map(aa => aa.id === a.id ? updated : aa));
                }}
                {...(selectedIds.includes(a.id) && { shadowColor: '#A9A9A9', shadowBlur: 10, shadowOpacity: 0.8 })}
              />
            ))}
            {texts.map(t => (
              <Text
                key={t.id}
                x={t.x}
                y={t.y}
                text={t.text}
                fontSize={t.fontSize}
                fill={t.fill}
                draggable={tool === 'select'}
                onClick={e => tool === 'select' && handleSelectShape(t.id, e.evt.ctrlKey)}
                onDragEnd={e => {
                  const updated = { ...t, x: e.target.x(), y: e.target.y() };
                  setTexts(ts => ts.map(tt => tt.id === t.id ? updated : tt));
                }}
                onDblClick={() => {
                  if (tool === 'select') {
                    const newText = window.prompt('Editar texto:', t.text);
                    if (newText !== null) {
                      setTexts(ts => ts.map(tt => tt.id === t.id ? { ...tt, text: newText } : tt));
                    }
                  }
                }}
                {...(selectedIds.includes(t.id) && { shadowColor: '#A9A9A9', shadowBlur: 10, shadowOpacity: 0.8 })}
              />
            ))}
            {notes.map(n => (
              <Group
                key={n.id}
                draggable={tool === 'select'}
                onClick={e => tool === 'select' && handleSelectShape(n.id, e.evt.ctrlKey)}
                onDragEnd={e => {
                  const updated = { ...n, x: e.target.x(), y: e.target.y() };
                  setNotes(ns => ns.map(nn => nn.id === n.id ? updated : nn));
                }}
                onDblClick={() => {
                  if (tool === 'select') {
                    const newText = window.prompt('Editar nota:', n.text);
                    if (newText !== null) {
                      setNotes(ns => ns.map(nn => nn.id === n.id ? { ...nn, text: newText } : nn));
                    }
                  }
                }}                {...(selectedIds.includes(n.id) && { shadowColor: '#A9A9A9', shadowBlur: 10, shadowOpacity: 0.8 })}
              >
                <Rect x={n.x} y={n.y} width={n.width} height={n.height} fill={n.fill} stroke={n.stroke} cornerRadius={5} />
                <Text x={n.x + 10} y={n.y + 10} text={n.text} fontSize={12} wrap="word" width={n.width - 20} ellipsis />
              </Group>
            ))}
          </Group>
        </Layer>

        <Layer>
          <Group x={panX} y={panY} scaleX={zoom} scaleY={zoom}>
            {lines.map(l => (
              <Line
                key={l.id}
                points={l.points}
                stroke={l.color}
                strokeWidth={l.strokeWidth}
                tension={0.5}
                lineCap="round"
                lineJoin="round"
                globalCompositeOperation={l.isEraser ? 'destination-out' : 'source-over'}
                onClick={e => tool === 'select' && handleSelectShape(l.id, e.evt.ctrlKey)}
                opacity={selectedIds.includes(l.id) ? 0.6 : 1}
              />
            ))}
          </Group>
        </Layer>
        <Layer>
          {selectionRect && (
            <Rect
              x={selectionRect.x}
              y={selectionRect.y}
              width={selectionRect.width}
              height={selectionRect.height}
              fill="rgba(0,120,215,0.2)"
              stroke="#0068c9"
              dash={[4,4]}
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
}

export default FreeDrawOverlay;
