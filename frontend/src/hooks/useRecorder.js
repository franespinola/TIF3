import { useState, useRef, useCallback } from 'react';

export default function useRecorder(patientName, onResult) {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const toggleRecording = useCallback(async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        chunksRef.current = [];
        const mr = new MediaRecorder(stream);
        mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
        mr.onstop = async () => {
          const blob = new Blob(chunksRef.current, { type: chunksRef.current[0]?.type });
          const file = new File([blob], `record_${Date.now()}.webm`, { type: blob.type });
          const formData = new FormData();
          formData.append('file', file);
          formData.append('patient', patientName);

          const response = await fetch('/api/process_audio', { method: 'POST', body: formData });
          if (!response.ok) {
            const text = await response.text();
            console.error('Error HTTP al procesar audio:', response.status, text);
            return;
          }
          const result = await response.json();
          onResult(result);
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
  }, [isRecording, patientName, onResult]);

  return { isRecording, toggleRecording };
}