import React, { useState } from 'react';

/**
 * Componente para mostrar y editar el resumen de una sesión con un paciente
 */
const SessionSummary = ({ 
  summary, 
  isLoading = false, 
  onEdit = () => {}, 
  onSave = () => {},
  readOnly = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedSummary, setEditedSummary] = useState(summary || "");

  const handleEdit = () => {
    setEditedSummary(summary);
    setIsEditing(true);
  };

  const handleSave = () => {
    onSave(editedSummary);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedSummary(summary);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden p-5">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-3 w-1/2"></div>
          <div className="h-3 bg-gray-200 rounded mb-3 w-full"></div>
          <div className="h-3 bg-gray-200 rounded mb-3 w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded mb-3 w-5/6"></div>
          <div className="h-3 bg-gray-200 rounded mb-3 w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-5 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Resumen de la Sesión</h2>
        </div>
        {!readOnly && (
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <button 
                  onClick={handleCancel}
                  className="px-3 py-1 text-sm bg-gray-50 text-gray-600 rounded hover:bg-gray-100 border border-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleSave}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Guardar
                </button>
              </>
            ) : (
              <button 
                onClick={handleEdit}
                className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
              >
                Editar
              </button>
            )}
          </div>
        )}
      </div>
      <div className="p-5">
        {isEditing ? (
          <textarea
            value={editedSummary}
            onChange={(e) => setEditedSummary(e.target.value)}
            className="w-full min-h-[300px] p-3 border border-gray-200 rounded resize-y focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        ) : (
          <div className="prose max-w-none">
            {summary ? (
              summary.split('\n').map((paragraph, idx) => (
                <p key={idx} className="mb-3">{paragraph}</p>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No hay resumen disponible para esta sesión.</p>
                {!readOnly && (
                  <button 
                    onClick={onEdit}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Generar Resumen
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionSummary;