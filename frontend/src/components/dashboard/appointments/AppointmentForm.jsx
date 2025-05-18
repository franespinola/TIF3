import React, { useState, useEffect } from 'react';
import appointmentService from '../../../services/appointmentService';
import patientService from '../../../services/patientService';
import { v4 as uuidv4 } from 'uuid';

/**
 * Formulario para crear o editar citas
 * 
 * @param {Object} props
 * @param {Object} props.initialData - Datos iniciales para el formulario (opcional)
 * @param {string} props.patientId - ID del paciente para pre-seleccionar (opcional)
 * @param {Function} props.onSave - Función a llamar cuando se guarda la cita
 * @param {Function} props.onCancel - Función a llamar cuando se cancela
 */
const AppointmentForm = ({ initialData = null, patientId = null, onSave, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [patients, setPatients] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(false);

  // Estado para el formulario
  const [formData, setFormData] = useState({
    id: initialData?.id || uuidv4(),
    patient_id: initialData?.patient_id || patientId || '',
    date: initialData?.date ? new Date(initialData.date).toISOString().slice(0, 16) : '',
    duration_minutes: initialData?.duration_minutes || 60,
    notes: initialData?.notes || '',
    status: initialData?.status || 'scheduled',
    type: initialData?.type || 'consulta'
  });

  // Cargar la lista de pacientes
  useEffect(() => {
    const fetchPatients = async () => {
      setLoadingPatients(true);
      try {
        const response = await patientService.getAllPatients();
        setPatients(response.data);
      } catch (error) {
        console.error('Error al cargar pacientes:', error);
        setError('No se pudieron cargar los pacientes');
      } finally {
        setLoadingPatients(false);
      }
    };

    fetchPatients();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Preparar los datos para enviar al servidor
      const appointment = {
        ...formData,
        id: formData.id || uuidv4(),
        // Añadir date_time con el mismo valor que date para compatibilidad con el backend
        date_time: formData.date
      };
      
      // Imprimir el payload para verificar
      console.log("Payload enviado:", appointment);
      
      // Enviar la petición al servidor
      let response;
      if (initialData?.id) {
        response = await appointmentService.updateAppointment(initialData.id, appointment);
      } else {
        response = await appointmentService.createAppointment(appointment);
      }
      
      setSuccess(true);
      if (onSave) onSave(response.data);
    } catch (error) {
      console.error('Error al guardar la cita:', error);
      setError(
        error.response?.data?.message || 
        error.message || 
        'Ha ocurrido un error al guardar la cita'
      );
    } finally {
      setLoading(false);
    }
  };

  // Tipos de cita disponibles
  const appointmentTypes = [
    { label: "Consulta", value: "consulta" },
    { label: "Primera sesión familiar", value: "primera_sesion_familiar" },
    { label: "Sesión familiar", value: "sesion_familiar" },
    { label: "Consulta familiar", value: "consulta_familiar" },
    { label: "Seguimiento", value: "seguimiento" },
    { label: "Emergencia", value: "emergencia" }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          Cita guardada correctamente
        </div>
      )}
      
      <div>
        <label htmlFor="patient_id" className="block text-sm font-medium text-gray-700 mb-1">
          Paciente *
        </label>
        <select
          id="patient_id"
          name="patient_id"
          className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.patient_id}
          onChange={handleChange}
          required
          disabled={patientId !== null}
        >
          <option value="">Seleccionar paciente</option>
          {loadingPatients ? (
            <option value="" disabled>Cargando pacientes...</option>
          ) : (
            patients.map(patient => (
              <option key={patient.id} value={patient.id}>
                {patient.name}
              </option>
            ))
          )}
        </select>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            Fecha y hora *
          </label>
          <input
            type="datetime-local"
            id="date"
            name="date"
            className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.date}
            onChange={handleChange}
            required
            min={new Date().toISOString().slice(0, 16)}
          />
        </div>
        
        <div>
          <label htmlFor="duration_minutes" className="block text-sm font-medium text-gray-700 mb-1">
            Duración (minutos) *
          </label>
          <input
            type="number"
            id="duration_minutes"
            name="duration_minutes"
            min="15"
            step="15"
            className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.duration_minutes}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
          Tipo de cita *
        </label>
        <select
          id="type"
          name="type"
          className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.type}
          onChange={handleChange}
          required
        >
          {appointmentTypes.map(type => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>
      </div>
      
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
          Notas
        </label>
        <textarea
          id="notes"
          name="notes"
          rows="3"
          className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Notas adicionales para la cita"
        />
      </div>
      
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
        <button
          type="button"
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Guardando...' : initialData?.id ? 'Actualizar cita' : 'Agendar cita'}
        </button>
      </div>
    </form>
  );
};

export default AppointmentForm; 