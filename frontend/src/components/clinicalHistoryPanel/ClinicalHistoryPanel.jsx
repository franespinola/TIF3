import React, { useState, useEffect } from 'react';

/**
 * Panel lateral que muestra la historia clínica rápida del paciente seleccionado.
 * Se muestra del lado izquierdo de la pantalla y permite visualizar y editar
 * información clínica relevante sin salir del diagrama.
 */
const ClinicalHistoryPanel = ({ 
  selectedNode, 
  onUpdateNode, 
  isOpen, 
  onToggle,
  patientName 
}) => {
  // Estado para los campos editables de la historia clínica
  const [clinicalData, setClinicalData] = useState({
    diagnosis: '',
    symptoms: '',
    medications: '',
    allergies: '',
    familyHistory: '',
    pastConsultations: [],
    notes: ''
  });
  
  // Actualizar los datos clínicos cuando cambia el nodo seleccionado
  useEffect(() => {
    if (selectedNode && selectedNode.data && selectedNode.data.clinicalData) {
      setClinicalData(selectedNode.data.clinicalData);
    } else {
      // Datos predeterminados si el nodo no tiene historia clínica
      setClinicalData({
        diagnosis: '',
        symptoms: '',
        medications: '',
        allergies: '',
        familyHistory: '',
        pastConsultations: [],
        notes: ''
      });
    }
  }, [selectedNode]);
  
  // Manejar cambios en los campos de historia clínica
  const handleInputChange = (field, value) => {
    setClinicalData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Si tenemos un nodo seleccionado, actualizar sus datos
      if (selectedNode && onUpdateNode) {
        onUpdateNode(selectedNode.id, { 
          clinicalData: updated 
        });
      }
      
      return updated;
    });
  };
  
  // Añadir una nueva consulta
  const addConsultation = () => {
    const newConsultation = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      notes: '',
      treatment: ''
    };
    
    handleInputChange('pastConsultations', [
      ...clinicalData.pastConsultations,
      newConsultation
    ]);
  };
  
  // Actualizar una consulta existente
  const updateConsultation = (id, field, value) => {
    const updatedConsultations = clinicalData.pastConsultations.map(consult => 
      consult.id === id ? { ...consult, [field]: value } : consult
    );
    
    handleInputChange('pastConsultations', updatedConsultations);
  };
  
  // Eliminar una consulta
  const deleteConsultation = (id) => {
    const updatedConsultations = clinicalData.pastConsultations.filter(
      consult => consult.id !== id
    );
    
    handleInputChange('pastConsultations', updatedConsultations);
  };
  
  // Si el panel está cerrado, solo mostrar un botón para abrirlo
  if (!isOpen) {
    return (
      <div 
        className="clinical-history-panel-closed"
        style={{
          position: 'absolute',
          left: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 1000,
          backgroundColor: '#f0f9ff',
          borderRadius: '0 8px 8px 0',
          boxShadow: '2px 0 10px rgba(0, 0, 0, 0.1)',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
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
            <path d="M22 12h-6l-2 3h-4l-2-3H2"/>
            <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>
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
            Historia Clínica
          </div>
        </div>
      </div>
    );
  }
  
  // Contenido del panel
  return (
    <div 
      className="clinical-history-panel"
      style={{
        position: 'absolute',
        left: 0,
        top: 48, // Para dejar espacio para la barra de menú
        width: '300px',
        height: 'calc(100vh - 48px)',
        backgroundColor: '#f0f9ff',
        borderRight: '1px solid #e0e7ff',
        boxShadow: '2px 0 10px rgba(0, 0, 0, 0.1)',
        zIndex: 1000,
        overflowY: 'auto',
        transition: 'all 0.3s ease',
        display: 'flex',
        flexDirection: 'column'
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
            <path d="M22 12h-6l-2 3h-4l-2-3H2"/>
            <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>
          </svg>
          <h3 style={{ margin: 0 }}>Historia Clínica</h3>
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
      
      {/* Contenido del paciente */}
      <div style={{ padding: '15px' }}>
        {selectedNode ? (
          <>
            <div style={{ 
              padding: '10px 15px',
              backgroundColor: '#e0f2fe',
              borderRadius: '8px',
              marginBottom: '15px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: selectedNode.type === 'masculinoNode' ? '#2563eb' : 
                                selectedNode.type === 'femeninoNode' ? '#db2777' : 
                                selectedNode.type === 'pacienteNode' ? '#047857' : '#64748b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '18px'
              }}>
                {selectedNode.data.name ? selectedNode.data.name.charAt(0).toUpperCase() : '?'}
              </div>
              <div>
                <h3 style={{ margin: 0, color: '#0369a1' }}>
                  {selectedNode.data.name || 'Sin nombre'}
                </h3>
                <div style={{ fontSize: '14px', color: '#64748b' }}>
                  {selectedNode.data.age ? `${selectedNode.data.age} años` : 'Edad no especificada'}
                  {selectedNode.data.profession ? ` • ${selectedNode.data.profession}` : ''}
                </div>
              </div>
            </div>
            
            {/* Secciones de la historia clínica */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {/* Diagnóstico */}
              <section>
                <h4 style={{ color: '#0369a1', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M8 2h8a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4c0-1.1.9-2 2-2z"/>
                    <path d="M4 8h2M4 12h2M4 16h2M12 6h2M12 10h2M12 18h2M12 14h2"/>
                  </svg>
                  Diagnóstico
                </h4>
                <textarea
                  value={clinicalData.diagnosis}
                  onChange={(e) => handleInputChange('diagnosis', e.target.value)}
                  placeholder="Ingrese el diagnóstico..."
                  style={{
                    width: '100%',
                    minHeight: '80px',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '14px',
                    resize: 'vertical'
                  }}
                />
              </section>
              
              {/* Síntomas */}
              <section>
                <h4 style={{ color: '#0369a1', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v3"/>
                  </svg>
                  Síntomas
                </h4>
                <textarea
                  value={clinicalData.symptoms}
                  onChange={(e) => handleInputChange('symptoms', e.target.value)}
                  placeholder="Describa los síntomas..."
                  style={{
                    width: '100%',
                    minHeight: '80px',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '14px',
                    resize: 'vertical'
                  }}
                />
              </section>
              
              {/* Medicación */}
              <section>
                <h4 style={{ color: '#0369a1', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m9 12 2 2 4-4"/>
                    <path d="M5 7c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7Z"/>
                    <path d="M9 3v4M15 3v4"/>
                  </svg>
                  Medicación
                </h4>
                <textarea
                  value={clinicalData.medications}
                  onChange={(e) => handleInputChange('medications', e.target.value)}
                  placeholder="Medicamentos actuales..."
                  style={{
                    width: '100%',
                    minHeight: '60px',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '14px',
                    resize: 'vertical'
                  }}
                />
              </section>
              
              {/* Alergias */}
              <section>
                <h4 style={{ color: '#0369a1', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M8.4 10.6a1 1 0 0 0 0 1.4l4.6 4.6a1 1 0 0 0 1.4 0l4.6-4.6a1 1 0 0 0 0-1.4L14.4 6a1 1 0 0 0-1.4 0Z"/>
                    <path d="M4 15h2M4 9h2M12 2v2M12 20v2M20 9h-2M20 15h-2"/>
                  </svg>
                  Alergias
                </h4>
                <textarea
                  value={clinicalData.allergies}
                  onChange={(e) => handleInputChange('allergies', e.target.value)}
                  placeholder="Alergias conocidas..."
                  style={{
                    width: '100%',
                    minHeight: '60px',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '14px',
                    resize: 'vertical'
                  }}
                />
              </section>
              
              {/* Antecedentes familiares */}
              <section>
                <h4 style={{ color: '#0369a1', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z"/>
                    <path d="M12 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>
                    <path d="M16 17a4 4 0 0 0-8 0"/>
                  </svg>
                  Antecedentes Familiares
                </h4>
                <textarea
                  value={clinicalData.familyHistory}
                  onChange={(e) => handleInputChange('familyHistory', e.target.value)}
                  placeholder="Antecedentes familiares relevantes..."
                  style={{
                    width: '100%',
                    minHeight: '80px',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '14px',
                    resize: 'vertical'
                  }}
                />
              </section>
              
              {/* Consultas anteriores */}
              <section>
                <div style={{ 
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '10px'
                }}>
                  <h4 style={{ color: '#0369a1', margin: 0, display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 12h4l3 8 4-16 3 8h4"/>
                    </svg>
                    Consultas Previas
                  </h4>
                  <button
                    onClick={addConsultation}
                    style={{
                      backgroundColor: '#0284c7',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '4px 8px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 5v14M5 12h14"/>
                    </svg>
                    Añadir
                  </button>
                </div>
                
                {clinicalData.pastConsultations.length > 0 ? (
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '10px',
                    maxHeight: '200px',
                    overflowY: 'auto',
                    padding: '5px'
                  }}>
                    {clinicalData.pastConsultations.map((consultation) => (
                      <div 
                        key={consultation.id}
                        style={{
                          border: '1px solid #cbd5e1',
                          borderRadius: '6px',
                          padding: '10px',
                          backgroundColor: '#f8fafc'
                        }}
                      >
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '8px'
                        }}>
                          <div style={{
                            fontWeight: 'bold',
                            fontSize: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px'
                          }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2">
                              <path d="M3 10h18M3 14h18M12 10v8"/>
                              <path d="M5 6h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"/>
                            </svg>
                            <input
                              type="date"
                              value={consultation.date}
                              onChange={(e) => updateConsultation(consultation.id, 'date', e.target.value)}
                              style={{
                                border: 'none',
                                backgroundColor: 'transparent',
                                fontSize: '14px',
                                color: '#0284c7',
                                fontWeight: 'bold',
                                padding: '0'
                              }}
                            />
                          </div>
                          <button
                            onClick={() => deleteConsultation(consultation.id)}
                            style={{
                              backgroundColor: 'transparent',
                              border: 'none',
                              color: '#ef4444',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              padding: '2px'
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6"/>
                            </svg>
                          </button>
                        </div>
                        
                        <div style={{ marginBottom: '8px' }}>
                          <label style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '4px' }}>
                            Notas:
                          </label>
                          <textarea
                            value={consultation.notes}
                            onChange={(e) => updateConsultation(consultation.id, 'notes', e.target.value)}
                            placeholder="Notas de la consulta..."
                            style={{
                              width: '100%',
                              minHeight: '40px',
                              padding: '6px 8px',
                              borderRadius: '4px',
                              border: '1px solid #cbd5e1',
                              fontSize: '13px',
                              resize: 'vertical'
                            }}
                          />
                        </div>
                        
                        <div>
                          <label style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '4px' }}>
                            Tratamiento:
                          </label>
                          <textarea
                            value={consultation.treatment}
                            onChange={(e) => updateConsultation(consultation.id, 'treatment', e.target.value)}
                            placeholder="Tratamiento indicado..."
                            style={{
                              width: '100%',
                              minHeight: '40px',
                              padding: '6px 8px',
                              borderRadius: '4px',
                              border: '1px solid #cbd5e1',
                              fontSize: '13px',
                              resize: 'vertical'
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{
                    textAlign: 'center',
                    padding: '20px 10px',
                    backgroundColor: '#f1f5f9',
                    borderRadius: '6px',
                    color: '#64748b',
                    fontSize: '14px'
                  }}>
                    No hay consultas previas registradas
                  </div>
                )}
              </section>
              
              {/* Notas generales */}
              <section>
                <h4 style={{ color: '#0369a1', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 3v4a1 1 0 0 0 1 1h4"/>
                    <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z"/>
                    <path d="M9 9h1M9 13h6M9 17h6"/>
                  </svg>
                  Notas Generales
                </h4>
                <textarea
                  value={clinicalData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Notas adicionales..."
                  style={{
                    width: '100%',
                    minHeight: '100px',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '14px',
                    resize: 'vertical'
                  }}
                />
              </section>
            </div>
          </>
        ) : (
          // Mensaje cuando no hay nodo seleccionado
          <div style={{
            textAlign: 'center',
            padding: '30px 10px',
            color: '#64748b',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '15px'
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
              <path d="M9 2h6v6H9zM12 14c.6.5 1 1.5 1 2a2 2 0 0 1-2 2 2 2 0 0 1-2-2c0-.6.4-1.5 1-2"/>
              <path d="M12 12v-2"/>
            </svg>
            <p style={{ fontSize: '16px', fontWeight: 'bold' }}>
              Seleccione un nodo para ver su historia clínica
            </p>
            <p style={{ fontSize: '14px' }}>
              La información se mostrará y podrá editarse aquí
            </p>
            {patientName && (
              <div style={{
                marginTop: '20px',
                padding: '10px 15px',
                backgroundColor: '#dbeafe',
                borderRadius: '8px',
                fontSize: '14px'
              }}>
                <p>Paciente principal: <strong>{patientName}</strong></p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClinicalHistoryPanel;