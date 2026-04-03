import { useEffect, useState } from "react";
import { Alert } from "react-native";
import StorageService from "../helpers/StorageService";
import api from "../models/users";

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
        setIsLoading(true);
        console.log("Obteniendo médicos del backend...");
        
        const response = await api.get('/medicos/GetAllMedicos');
        
        console.log("Respuesta de médicos:", response.data);
        
        // CORRECCIÓN: Usar _id en lugar de id para mantener consistencia
        const medicosFormateados = response.data.map(medico => ({
          _id: medico.id,  // Mapear 'id' del backend a '_id' para el frontend
          username: medico.username,
          especialidad: medico.especialidad,
          cedula: medico.cedula
        }));
        
        console.log("Médicos formateados:", medicosFormateados);
        setMedicos(medicosFormateados);
        
      } catch (error) {
        console.error("Error cargando médicos:", error);
        console.error("Detalle del error:", error.response?.data);
        Alert.alert("Error", "No se pudieron cargar los médicos. Por favor intenta de nuevo.");
      } finally {
        setIsLoading(false);
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
        Alert.alert("Error", "La cita debe ser programada a partir de mañana.");
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
    Alert.alert("Error", "Por favor completa todos los campos.");
    return;
  }

  setIsLoading(true);
  
  try {
    const userData = await StorageService.getItem('userData');

    if (!userData) {
      Alert.alert("Error", "No se encontraron datos de usuario. Por favor inicia sesión nuevamente.");
      setIsLoading(false);
      return;
    }

    const pacienteId = userData._id;
    const userRole = typeof userData.role === 'string' ? parseInt(userData.role) : userData.role;

    if (!pacienteId) {
      Alert.alert("Error", "No se encontró el ID del paciente.");
      setIsLoading(false);
      return;
    }

    if (userRole !== 3) {
      Alert.alert("Error", `Solo los pacientes pueden agendar citas. Tu rol es: ${userRole}`);
      setIsLoading(false);
      return;
    }

    const [h, m] = hora.split(':');
    const finalDate = new Date(dateObject);
    finalDate.setHours(parseInt(h), parseInt(m), 0);

    const appointmentData = {
      paciente_id: pacienteId,
      medico_id: medicoSeleccionado,
      fecha_hora: finalDate.toISOString(),
      status: "pendiente",
      motivo: motivo.trim(),
    };

    console.log("\n OBJETO COMPLETO:");
    console.log(JSON.stringify(appointmentData, null, 2));
    console.log("==========================================\n");

    const response = await api.post('/appointments/createAppointments', appointmentData);

    console.log(" Respuesta exitosa:", response.data);
    Alert.alert("Éxito", response.data.msg || response.data.message || "Cita agendada con éxito");

    setFecha("");
    setHora("");
    setMedicoSeleccionado("");
    setMotivo("");
    setDateObject(new Date());

    return true;

  } catch (error) {
    console.error("\n ERROR EN LA PETICIÓN:");
    console.error("Status:", error.response?.status);
    console.error("Mensaje:", error.response?.data?.msg || error.response?.data?.message);
    console.error("Error completo:", error.response?.data);
    
    let errorMessage = "No se pudo agendar la cita.";
    if (error.response?.data?.msg) {
      errorMessage = error.response.data.msg;
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }
    
    Alert.alert("Error", errorMessage);
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