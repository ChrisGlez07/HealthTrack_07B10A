import { useEffect, useState } from "react";
import StorageService from "../helpers/StorageService";

const useCreateAppointment = () => {
  const [fecha, setFecha] = useState(""); 
  const [hora, setHora] = useState("");   
  const [dateObject, setDateObject] = useState(new Date()); 
  const [showPicker, setShowPicker] = useState(false);
  
  const [medicos, setMedicos] = useState([]);
  const [medicoSeleccionado, setMedicoSeleccionado] = useState("");
  const [motivo, setMotivo] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const horasDisponibles = [
    "08:00", "09:00", "10:00", "11:00", "12:00", 
    "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"
  ];

  useEffect(() => {
    const fetchMedicos = async () => {
      try {
        // FECTH REAL A LA LISTA DE MEDICOS
        setMedicos([
          { _id: "65f1a...", username: "Dr. Garcia", especialidad: "Cardiología" },
          { _id: "65f1b...", username: "Dra. Perez", especialidad: "Pediatría" }
        ]);
      } catch (error) {
        console.error("Error cargando médicos", error);
      }
    };
    fetchMedicos();
  }, []);

  const onChangePicker = (event, selectedDate) => {
    setShowPicker(false);
    if (selectedDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0); 
      
      if (selectedDate <= today) {
        alert("La cita debe ser programada a partir de mañana.");
        return;
      }

      setDateObject(selectedDate);
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const year = selectedDate.getFullYear();
      setFecha(`${day}-${month}-${year}`);
    }
  };

  const handleCreateAppointment = async () => {
    if (!fecha || !hora || !medicoSeleccionado || !motivo) {
      alert("Por favor completa todos los campos.");
      return;
    }

    setIsLoading(true);
    try {
      const pacienteId = await StorageService.getItem('userId'); 

      const [h, m] = hora.split(':');
      const finalDate = new Date(dateObject);
      finalDate.setHours(parseInt(h), parseInt(m), 0);

      const appointmentData = {
        paciente_id: pacienteId,
        medico_id: medicoSeleccionado, 
        fecha_hora: finalDate,
        status: "pendiente", 
        motivo: motivo,
      };
      
      console.log("Enviando cita...", appointmentData);
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert("Cita agendada con éxito");
      return true;
    } catch {
      alert("Error al guardar la cita");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    fecha, 
    hora, 
    setHora, 
    horasDisponibles,
    medicoSeleccionado, 
    setMedicoSeleccionado,
    medicos, 
    motivo, 
    setMotivo,
    showPicker, 
    setShowPicker, 
    dateObject, 
    onChangePicker,
    handleCreateAppointment, 
    isLoading
  };
};

export default useCreateAppointment;