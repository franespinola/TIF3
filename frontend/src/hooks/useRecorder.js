import { useState, useRef, useCallback } from 'react';
import sessionService from '../services/sessionService';
import patientService from '../services/patientService';

export default function useRecorder(patientName, onResult, createdBy = null) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  // Función para verificar si el paciente existe, y crearlo si no
  const verifyPatient = async (name) => {
    try {
      // Intentamos buscar al paciente por nombre
      const response = await patientService.getAllPatients(name);
      const patients = response.data;
      
      // Si no hay coincidencia exacta, creamos el paciente
      const exactMatch = patients.find(p => 
        p.name.toLowerCase() === name.toLowerCase()
      );
      
      if (!exactMatch) {
        // Creamos un paciente básico para permitir la grabación
        await patientService.createPatient({
          name: name,
          age: 0, // Valores por defecto que luego pueden ser actualizados
          gender: 'No especificado',
          email: `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
          phone: '000-000-0000'
        });
        console.log(`Paciente ${name} creado automáticamente`);
      }
      
      return true;
    } catch (error) {
      console.error('Error al verificar/crear paciente:', error);
      return false;
    }
  };

  const toggleRecording = useCallback(async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        chunksRef.current = [];
        const mr = new MediaRecorder(stream);
        mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
        mr.onstop = async () => {
          setIsProcessing(true);
          const blob = new Blob(chunksRef.current, { type: chunksRef.current[0]?.type });
          const file = new File([blob], `record_${Date.now()}.webm`, { type: blob.type });
          
          try {
            // Verificar y crear paciente si es necesario
            const patientExists = await verifyPatient(patientName);
            
            if (patientExists) {
              // Usar el servicio para procesar el audio
              const { data } = await sessionService.processAudioSession(file, patientName, createdBy);
              onResult(data);
            } else {
              console.error('No se pudo crear/verificar el paciente');
              alert('No se pudo verificar el paciente. Intente de nuevo.');
            }
          } catch (error) {
            console.error('Error al procesar audio:', error);
          } finally {
            setIsProcessing(false);
          }
        };
        mr.start();
        mediaRecorderRef.current = mr;
        setIsRecording(true);
      } catch (err) {
        console.error('Error al iniciar la grabación:', err);
      }
    } else {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
    }
  }, [isRecording, patientName, createdBy, onResult]);
  return { isRecording, isProcessing, toggleRecording };
}