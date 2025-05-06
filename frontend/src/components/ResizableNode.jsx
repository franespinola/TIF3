import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useReactFlow } from 'reactflow';

/**
 * Component that adds resize functionality to ReactFlow nodes
 */
const ResizableNode = ({
  id,
  children,
  width,
  height, 
  minWidth = 30,
  minHeight = 30,
  onResize,
  selected = false,
  forceAspectRatio = false,
  style = {},
}) => {
  const nodeRef = useRef(null);
  const [resizing, setResizing] = useState(false);
  const [initialMousePos, setInitialMousePos] = useState({ x: 0, y: 0 });
  const [initialDimensions, setInitialDimensions] = useState({ width: 0, height: 0 });
  const reactFlowInstance = useReactFlow();
  
  // Style for resize handle
  const resizeHandleStyle = {
    position: 'absolute',
    width: '10px',
    height: '10px',
    background: selected ? '#1a192b' : 'transparent',
    border: selected ? '1px solid white' : 'none',
    right: '-6px',
    bottom: '-6px',
    cursor: 'nwse-resize',
    zIndex: 10,
  };
  
  // Handle when resize starts
  const handleResizeStart = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    
    setResizing(true);
    setInitialMousePos({ x: event.clientX, y: event.clientY });
    setInitialDimensions({ width, height });
    
    // Add event listeners for mousemove and mouseup
    document.addEventListener('mousemove', handleResizeMove);
    document.addEventListener('mouseup', handleResizeEnd);
  }, [width, height]);
  
  // Handle resizing while mouse moves
  const handleResizeMove = useCallback((event) => {
    if (!resizing) return;
    
    const deltaX = event.clientX - initialMousePos.x;
    const deltaY = event.clientY - initialMousePos.y;
    
    let newWidth = Math.max(initialDimensions.width + deltaX, minWidth);
    let newHeight = Math.max(initialDimensions.height + deltaY, minHeight);
    
    // Maintain aspect ratio if required
    if (forceAspectRatio) {
      const aspectRatio = initialDimensions.width / initialDimensions.height;
      // Determine which dimension to constrain based on which changed more
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        newHeight = newWidth / aspectRatio;
      } else {
        newWidth = newHeight * aspectRatio;
      }
    }
    
    // Call the onResize callback with the new dimensions
    if (onResize) {
      onResize({ width: newWidth, height: newHeight });
    }
    
    // Update the node in ReactFlow if needed
    if (reactFlowInstance && id) {
      reactFlowInstance.setNodes(nodes =>
        nodes.map(node =>
          node.id === id ? {
            ...node,
            style: { ...node.style, width: newWidth, height: newHeight }
          } : node
        )
      );
    }
  }, [resizing, initialMousePos, initialDimensions, minWidth, minHeight, forceAspectRatio, onResize, reactFlowInstance, id]);
  
  // Handle when resize ends
  const handleResizeEnd = useCallback(() => {
    setResizing(false);
    
    // Remove event listeners
    document.removeEventListener('mousemove', handleResizeMove);
    document.removeEventListener('mouseup', handleResizeEnd);
  }, [handleResizeMove]);
  
  // Cleanup event listeners on unmount
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleResizeMove);
      document.removeEventListener('mouseup', handleResizeEnd);
    };
  }, [handleResizeMove, handleResizeEnd]);
  
  return (
    <div
      ref={nodeRef}
      style={{
        position: 'relative',
        width: `${width}px`,
        height: `${height}px`,
        ...style
      }}
    >
      {children}
      {selected && (
        <div
          className="resize-handle"
          style={resizeHandleStyle}
          onMouseDown={handleResizeStart}
        />
      )}
    </div>
  );
};

export default ResizableNode;