import { useState, useCallback } from 'react';

/**
 * Hook personalizado para manejar la edición in-situ en nodos
 * @param {string} initialValue - Valor inicial del texto
 * @param {function} onSave - Función a llamar cuando se guarda el texto editado
 * @returns {Object} - Estado y funciones para manejar la edición
 */
function useNodeEditor(initialValue = '', onSave) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);

  const handleDoubleClick = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleChange = useCallback((e) => {
    setValue(e.target.value);
  }, []);

  const handleBlur = useCallback(() => {
    setIsEditing(false);
    if (onSave) {
      onSave(value);
    }
  }, [value, onSave]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
      if (onSave) {
        onSave(value);
      }
    }
  }, [value, onSave]);

  return {
    isEditing,
    value,
    setValue,
    handleDoubleClick,
    handleChange,
    handleBlur,
    handleKeyDown
  };
}

export default useNodeEditor;