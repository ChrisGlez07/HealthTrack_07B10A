import { useState } from "react";
import StorageService from "../helpers/StorageService";

const useCreateAppointment = () => {
  const [fechaHora, setFechaHora] = useState(""); 
  const [dateObject, setDateObject] = useState(new Date()); 
  const [showPicker, setShowPicker] = useState(false);
  const [mode, setMode] = useState('date'); 
  
  const [status, setStatus] = useState("Pendiente");
  const [motivo, setMotivo] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };

  const onChangePicker = (event, selectedDate) => {
    setShowPicker(false);
    if (selectedDate) {
      setDateObject(selectedDate);
      const formatted = formatDate(selectedDate);
      setFechaHora(formatted);
      
      if (mode === 'date') {
        showMode('time');
      }
    }
  };

  const showMode = (currentMode) => {
    setShowPicker(true);
    setMode(currentMode);
  };

  const handleCreateAppointment = async () => {
    if (!StorageService.validate('date', fechaHora)) {
      alert("Por favor selecciona una fecha y hora válida.");
      return;
    }

    setIsLoading(true);
    try {
      // Aquí obtendrías el token: const token = await StorageService.getToken('userToken');
      const appointmentData = {
        fecha_hora: fechaHora,
        status,
        motivo,
      };
      
      console.log("Enviando cita...", appointmentData);
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert("Cita creada con éxito");
      return true;
    } catch  {
      alert("Error al conectar con el servidor");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    fechaHora, setFechaHora,
    status, setStatus,
    motivo, setMotivo,
    showPicker, mode, dateObject, 
    onChangePicker, showMode,
    handleCreateAppointment,
    isLoading
  };
};

export default useCreateAppointment;