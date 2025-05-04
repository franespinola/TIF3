import React, { useState, useEffect } from 'react';

/**
 * Componente para gestionar notas de sesión e integrarlas con el genograma.
 * Permite al terapeuta tomar notas durante la sesión y vincularlas con
 * los elementos del genograma.
 */
const SessionNotesPanel = ({ 
  isOpen, 
  onToggle, 
  selectedNode, 
  nodes, 
  edges,
  patientName,
  style = {} // Nuevo prop para estilos personalizados
}) => {
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState('');
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Cargar notas desde localStorage al inicio
  useEffect(() => {
    const savedNotes = localStorage.getItem('sessionNotes');
    if (savedNotes) {
      try {
        setNotes(JSON.parse(savedNotes));
      } catch (e) {
        console.error('Error al cargar notas:', e);
        setNotes([]);
      }
    }
  }, []);
  
  // Guardar notas en localStorage cada vez que cambien
  useEffect(() => {
    localStorage.setItem('sessionNotes', JSON.stringify(notes));
  }, [notes]);
  
  // Añadir una nueva nota
  const addNote = () => {
    if (!currentNote.trim()) return;
    
    const newNote = {
      id: Date.now(),
      content: currentNote,
      timestamp: new Date().toISOString(),
      nodeId: selectedNode ? selectedNode.id : null,
      nodeName: selectedNode ? selectedNode.data.name : null,
      nodeType: selectedNode ? selectedNode.type : null,
      tags: extractHashtags(currentNote),
      isHighlighted: false
    };
    
    setNotes([newNote, ...notes]);
    setCurrentNote('');
  };
  
  // Extraer hashtags de texto
  const extractHashtags = (text) => {
    const hashtags = text.match(/#[a-zA-Z0-9_]+/g);
    return hashtags ? hashtags.map(tag => tag.slice(1)) : [];
  };
  
  // Editar una nota existente
  const updateNote = () => {
    if (!currentNote.trim() || !editingNoteId) return;
    
    const updatedNotes = notes.map(note => 
      note.id === editingNoteId 
        ? { 
            ...note, 
            content: currentNote, 
            tags: extractHashtags(currentNote),
            updatedAt: new Date().toISOString() 
          } 
        : note
    );
    
    setNotes(updatedNotes);
    setCurrentNote('');
    setEditingNoteId(null);
  };
  
  // Eliminar una nota
  const deleteNote = (id) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);
    
    if (editingNoteId === id) {
      setCurrentNote('');
      setEditingNoteId(null);
    }
  };
  
  // Seleccionar una nota para editar
  const editNote = (note) => {
    setCurrentNote(note.content);
    setEditingNoteId(note.id);
  };
  
  // Resaltar/destacar una nota
  const toggleHighlight = (id) => {
    const updatedNotes = notes.map(note => 
      note.id === id ? { ...note, isHighlighted: !note.isHighlighted } : note
    );
    setNotes(updatedNotes);
  };
  
  // Vincular una nota a un nodo seleccionado
  const linkToSelectedNode = (noteId) => {
    if (!selectedNode) return;
    
    const updatedNotes = notes.map(note => 
      note.id === noteId 
        ? { 
            ...note, 
            nodeId: selectedNode.id,
            nodeName: selectedNode.data.name,
            nodeType: selectedNode.type,
            updatedAt: new Date().toISOString()
          } 
        : note
    );
    
    setNotes(updatedNotes);
  };
  
  // Desvincular una nota de un nodo
  const unlinkFromNode = (noteId) => {
    const updatedNotes = notes.map(note => 
      note.id === noteId 
        ? { 
            ...note, 
            nodeId: null,
            nodeName: null,
            nodeType: null,
            updatedAt: new Date().toISOString()
          } 
        : note
    );
    
    setNotes(updatedNotes);
  };
  
  // Filtrar notas según criterios
  const filteredNotes = notes.filter(note => {
    // Primero filtrar por búsqueda
    const matchesSearch = searchTerm === '' || 
      note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (!matchesSearch) return false;
    
    // Luego filtrar por tipo
    switch(filter) {
      case 'linked':
        return note.nodeId !== null;
      case 'unlinked':
        return note.nodeId === null;
      case 'highlighted':
        return note.isHighlighted;
      case 'patient':
        return note.nodeId !== null && note.nodeType === 'pacienteNode';
      case 'family':
        return note.nodeId !== null && ['masculinoNode', 'femeninoNode'].includes(note.nodeType);
      case 'all':
      default:
        return true;
    }
  });
  
  // Encontrar el nodo asociado a una nota
  const findNodeById = (nodeId) => {
    return nodes.find(node => node.id === nodeId);
  };
  
  // Obtener color de fondo según tipo de nodo
  const getNodeColor = (nodeType) => {
    switch(nodeType) {
      case 'masculinoNode': return '#dbeafe'; // azul claro
      case 'femeninoNode': return '#fce7f3'; // rosa claro
      case 'pacienteNode': return '#d1fae5'; // verde claro
      default: return '#f8fafc'; // gris muy claro
    }
  };
  
  // Formatear fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Renderizado condicional si el panel está cerrado
  if (!isOpen) {
    return (
      <div 
        className="session-notes-panel-closed"
        style={{
          position: 'absolute',
          right: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 1000,
          backgroundColor: '#f0f9ff',
          borderRadius: '8px 0 0 8px',
          boxShadow: '-2px 0 10px rgba(0, 0, 0, 0.1)',
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }}
        onClick={onToggle}
      >
        <div style={{
          padding: '10px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2">
            <path d="M14 3v4a1 1 0 0 0 1 1h4"/>
            <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z"/>
            <path d="M9 9h1M9 13h6M9 17h6"/>
          </svg>
          <div 
            style={{
              writingMode: 'vertical-rl',
              textOrientation: 'mixed',
              transform: 'rotate(180deg)',
              marginTop: '10px',
              fontWeight: 'bold',
              color: '#0284c7'
            }}
          >
            Notas de Sesión
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      className="session-notes-panel"
      style={{
        position: 'absolute',
        right: 0,
        top: 88, // MenuBar (48px) + SubMenuBar (40px)
        width: '440px', // Actualizado de 420px a 440px para coincidir con ClinicalTabsPanel
        height: 'calc(100vh - 88px)',
        backgroundColor: '#f0f9ff',
        borderLeft: '1px solid #e0e7ff',
        boxShadow: '-2px 0 10px rgba(0, 0, 0, 0.1)',
        zIndex: 1000,
        overflowY: 'auto',
        overflowX: 'hidden', // Evita scroll horizontal
        transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        display: 'flex',
        flexDirection: 'column',
        animation: 'slideInRight 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
        boxSizing: 'border-box', // Incluir padding y border en el ancho
        ...style // Aplicar estilos personalizados
      }}
    >
      {/* Encabezado del panel */}
      <div style={{
        padding: '15px',
        backgroundColor: '#0284c7',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 3v4a1 1 0 0 0 1 1h4"/>
            <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z"/>
            <path d="M9 9h1M9 13h6M9 17h6"/>
          </svg>
          <h3 style={{ margin: 0 }}>Notas de Sesión</h3>
        </div>
        
        {/* Botón para cerrar el panel */}
        <button 
          onClick={onToggle}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4px'
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>
      
      {/* Área de entrada para añadir/editar nota */}
      <div style={{ 
        padding: '15px 20px', // Aumentado el padding horizontal
        borderBottom: '1px solid #e0e7ff',
        backgroundColor: 'white'
      }}>
        <textarea
          value={currentNote}
          onChange={(e) => setCurrentNote(e.target.value)}
          placeholder={`Escribe una nota para la sesión${selectedNode ? ` (relacionada con ${selectedNode.data.name || 'nodo seleccionado'})` : ''}...`}
          style={{
            width: '100%',
            minHeight: '100px',
            padding: '12px',
            borderRadius: '6px',
            border: '1px solid #cbd5e1',
            marginBottom: '10px',
            fontSize: '14px',
            resize: 'vertical',
            boxSizing: 'border-box' // Asegurar que padding y border estén dentro del width
          }}
        />
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          gap: '8px'
        }}>
          <button
            onClick={editingNoteId ? updateNote : addNote}
            style={{
              flex: '1',
              padding: '8px 16px',
              backgroundColor: '#0284c7',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '5px'
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d={editingNoteId 
                ? "M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" 
                : "M12 5v14M5 12h14"} />
            </svg>
            {editingNoteId ? 'Actualizar Nota' : 'Añadir Nota'}
          </button>
          
          {editingNoteId && (
            <button
              onClick={() => {
                setCurrentNote('');
                setEditingNoteId(null);
              }}
              style={{
                padding: '8px 12px',
                backgroundColor: '#f1f5f9',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Cancelar
            </button>
          )}
        </div>
        
        {selectedNode && (
          <div style={{
            marginTop: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 10px',
            backgroundColor: getNodeColor(selectedNode.type),
            borderRadius: '6px',
            fontSize: '12px'
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              <path d="M3.29 7L12 12l8.71-5"/>
              <path d="M12 22V12"/>
            </svg>
            Vinculado a: <strong>{selectedNode.data.name || 'Nodo sin nombre'}</strong>
          </div>
        )}
      </div>
      
      {/* Barra de búsqueda y filtros */}
      <div style={{ 
        padding: '10px 20px', // Aumentado el padding horizontal
        backgroundColor: '#f8fafc',
        borderBottom: '1px solid #e0e7ff',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        <div style={{ position: 'relative' }}>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="#64748b" 
            strokeWidth="2"
            style={{
              position: 'absolute',
              top: '50%',
              left: '10px',
              transform: 'translateY(-50%)'
            }}
          >
            <path d="M11 17.25a6.25 6.25 0 1 1 0-12.5 6.25 6.25 0 0 1 0 12.5Z"/>
            <path d="m16 16 4.5 4.5"/>
          </svg>
          
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar en notas..."
            style={{
              width: '100%',
              padding: '8px 10px 8px 32px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              fontSize: '13px',
              boxSizing: 'border-box' // Asegurar que padding y border estén dentro del width
            }}
          />
        </div>
        
        <div style={{ 
          display: 'flex', 
          overflowX: 'auto',
          gap: '6px',
          paddingBottom: '5px'
        }}>
          {['all', 'linked', 'unlinked', 'highlighted', 'patient', 'family'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '6px 10px',
                backgroundColor: filter === f ? '#0284c7' : '#f1f5f9',
                color: filter === f ? 'white' : '#64748b',
                border: filter === f ? 'none' : '1px solid #cbd5e1',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '12px',
                whiteSpace: 'nowrap'
              }}
            >
              {f === 'all' && 'Todas'}
              {f === 'linked' && 'Vinculadas'}
              {f === 'unlinked' && 'Sin vincular'}
              {f === 'highlighted' && 'Destacadas'}
              {f === 'patient' && 'Paciente'}
              {f === 'family' && 'Familia'}
            </button>
          ))}
        </div>
      </div>
      
      {/* Lista de notas */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto',
        padding: '10px 20px' // Aumentado el padding horizontal
      }}>
        {filteredNotes.length > 0 ? (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '15px'
          }}>
            {filteredNotes.map((note) => (
              <div 
                key={note.id}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  boxShadow: note.isHighlighted 
                    ? '0 0 0 2px #fb923c, 0 4px 6px rgba(0, 0, 0, 0.1)'
                    : '0 1px 3px rgba(0, 0, 0, 0.1)',
                  overflow: 'hidden'
                }}
              >
                {/* Cabecera de la nota */}
                <div style={{
                  padding: '10px 12px',
                  borderBottom: '1px solid #e2e8f0',
                  backgroundColor: note.isHighlighted ? '#fff7ed' : '#f8fafc',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ 
                    fontSize: '12px', 
                    color: '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 8v4l3 3M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0"/>
                    </svg>
                    {formatDate(note.timestamp)}
                  </div>
                  
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => toggleHighlight(note.id)}
                      title={note.isHighlighted ? 'Quitar destacado' : 'Destacar'}
                      style={{
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        color: note.isHighlighted ? '#fb923c' : '#94a3b8',
                        display: 'flex',
                        padding: '2px'
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill={note.isHighlighted ? '#fb923c' : 'none'} stroke="currentColor" strokeWidth="2">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    </button>
                    
                    <button
                      onClick={() => editNote(note)}
                      title="Editar nota"
                      style={{
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        color: '#94a3b8',
                        display: 'flex',
                        padding: '2px'
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    
                    <button
                      onClick={() => deleteNote(note.id)}
                      title="Eliminar nota"
                      style={{
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        color: '#94a3b8',
                        display: 'flex',
                        padding: '2px'
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                      </svg>
                    </button>
                  </div>
                </div>
                
                {/* Contenido de la nota */}
                <div style={{ padding: '12px' }}>
                  <p style={{ 
                    margin: '0 0 10px 0',
                    fontSize: '14px',
                    lineHeight: '1.5'
                  }}>
                    {note.content}
                  </p>
                  
                  {/* Etiquetas */}
                  {note.tags.length > 0 && (
                    <div style={{ 
                      display: 'flex', 
                      flexWrap: 'wrap',
                      gap: '6px',
                      marginBottom: '10px'
                    }}>
                      {note.tags.map((tag, idx) => (
                        <span 
                          key={idx}
                          style={{
                            fontSize: '11px',
                            padding: '2px 8px',
                            backgroundColor: '#f1f5f9',
                            borderRadius: '12px',
                            color: '#64748b'
                          }}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {/* Info de nodo vinculado */}
                  {note.nodeId ? (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 10px',
                      backgroundColor: getNodeColor(note.nodeType),
                      borderRadius: '6px',
                      fontSize: '12px',
                      marginTop: '8px'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                        </svg>
                        Vinculado a: <strong>{note.nodeName || 'Nodo sin nombre'}</strong>
                      </div>
                      
                      <button
                        onClick={() => unlinkFromNode(note.id)}
                        title="Desvincular"
                        style={{
                          border: 'none',
                          background: 'none',
                          cursor: 'pointer',
                          color: '#64748b',
                          padding: '2px',
                          display: 'flex'
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 6 6 18M6 6l12 12"/>
                        </svg>
                      </button>
                    </div>
                  ) : selectedNode && (
                    <button
                      onClick={() => linkToSelectedNode(note.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        width: '100%',
                        padding: '8px 10px',
                        backgroundColor: '#f1f5f9',
                        border: '1px dashed #cbd5e1',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        color: '#64748b',
                        marginTop: '8px'
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                      </svg>
                      Vincular con {selectedNode.data.name || 'nodo seleccionado'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '30px 0',
            color: '#94a3b8',
            textAlign: 'center'
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M14 3v4a1 1 0 0 0 1 1h4"/>
              <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z"/>
              <path d="M9 9h1M9 13h6M9 17h6"/>
            </svg>
            <p style={{ marginTop: '15px', fontSize: '14px' }}>
              {searchTerm 
                ? 'No se encontraron notas que coincidan con tu búsqueda' 
                : filter !== 'all' 
                  ? `No hay notas ${
                      filter === 'linked' ? 'vinculadas' : 
                      filter === 'unlinked' ? 'sin vincular' : 
                      filter === 'highlighted' ? 'destacadas' : 
                      filter === 'patient' ? 'del paciente' : 
                      'de familiares'
                    }` 
                  : 'No hay notas para esta sesión'
              }
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilter('all');
              }}
              style={{
                marginTop: '10px',
                padding: '6px 12px',
                backgroundColor: '#e0f2fe',
                color: '#0284c7',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '13px',
                display: filter !== 'all' || searchTerm ? 'block' : 'none'
              }}
            >
              Mostrar todas
            </button>
          </div>
        )}
      </div>
      
      {/* Información del paciente (si está disponible) */}
      {patientName && (
        <div style={{
          padding: '10px 15px',
          borderTop: '1px solid #e0e7ff',
          backgroundColor: '#e0f2fe',
          fontSize: '13px',
          color: '#0369a1',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
            <path d="M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/>
          </svg>
          <div>
            Paciente: <strong>{patientName}</strong>
            <div style={{ fontSize: '11px' }}>
              Sesión: {new Date().toLocaleDateString('es-ES')}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionNotesPanel;