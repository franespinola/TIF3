import React from 'react';

export default function DrawingTools({ activeTool, toggleTool, drawingColor, setDrawingColor, strokeWidth, setStrokeWidth }) {
  const headerStyle = {
    fontSize: '1.2rem',
    fontWeight: '600',
    marginBottom: '10px',
    borderBottom: '2px solid #3b82f6',
    paddingBottom: '5px',
    color: '#3b82f6',
  };
  const buttonStyle = {
    width: '100%',
    padding: '8px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '600',
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };
  // Styles for icons in the buttons
  const iconStyle = (active) => ({
    width: '16px',
    height: '16px',
    marginRight: '6px',
    fill: active ? '#fff' : '#334e68',
  });

  return (
    <div>
      <h3 style={headerStyle}>Dibujo Libre</h3>
      <div style={{ marginBottom: '10px', display: 'flex', gap: '8px' }}>
        <button
          onClick={() => toggleTool('select')}
          style={{ ...buttonStyle, background: activeTool === 'select' ? '#3b82f6' : '#ddd', color: activeTool === 'select' ? '#fff' : '#000' }}
        >
          <svg viewBox="0 0 24 24" style={iconStyle(activeTool==='select')}>
            <path d="M3 3l18 9-18 9V3z" />
          </svg>
          Seleccionar
        </button>
        <button
          onClick={() => toggleTool('pen')}
          style={{ ...buttonStyle, background: activeTool === 'pen' ? '#3b82f6' : '#ddd', color: activeTool === 'pen' ? '#fff' : '#000' }}
        >
          <svg viewBox="0 0 24 24" style={iconStyle(activeTool==='pen')}>
            <path d="M4 20h4L20 8l-4-4L4 16v4z" />
          </svg>
          Lápiz
        </button>
        <button
          onClick={() => toggleTool('eraser')}
          style={{ ...buttonStyle, background: activeTool === 'eraser' ? '#3b82f6' : '#ddd', color: activeTool === 'eraser' ? '#fff' : '#000' }}
        >
          <svg viewBox="0 0 24 24" style={iconStyle(activeTool==='eraser')}>
            <path d="M16.24 3.56l4.2 4.2c.78.78.78 2.05 0 2.83L10.87 20.56c-.78.78-2.05.78-2.83 0l-4.2-4.2c-.78-.78-.78-2.05 0-2.83l9.57-9.97c.78-.78 2.05-.78 2.83 0z" />
          </svg>
          Goma
        </button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        <label style={{ marginRight: '8px' }}>Color:</label>
        <input type="color" value={drawingColor} onChange={e => setDrawingColor(e.target.value)} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <label style={{ marginRight: '8px' }}>Grosor:</label>
        <input type="range" min="1" max="50" value={strokeWidth} onChange={e => setStrokeWidth(+e.target.value)} /> {/* Updated max to 50 */}
        <span style={{ marginLeft: '8px' }}>{strokeWidth}</span> {/* Display current value */}
      </div>
    </div>
  );
}