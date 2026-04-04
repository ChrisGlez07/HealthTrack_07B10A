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
  const [pacientes, setPacientes] = useState([]);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState("");
  const [motivo, setMotivo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const horasDisponibles = [
    "08:00", "09:00", "10:00", "11:00", "12:00",
    "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const userData = await StorageService.getItem('userData');
        setCurrentUser(userData);

        console.log("Obteniendo datos del backend...");
        
        const resMedicos = await api.get('/medicos/GetAllMedicos');
        const resPacientes = await api.get('/pacientes/getAllPacientes');
        
        const medicosFormateados = resMedicos.data.map(medico => ({
          _id: medico.id,
          username: medico.username,
          especialidad: medico.especialidad,
          cedula: medico.cedula
        }));

        const pacientesFormateados = resPacientes.data.map(paciente => ({
          _id: paciente.id,
          username: paciente.username,
          email: paciente.email
        }));
        
        setMedicos(medicosFormateados);
        setPacientes(pacientesFormateados);
        
      } catch (error) {
        console.error("Error cargando datos:", error);
        Alert.alert("Error", "No se pudieron cargar los datos.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
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
    if (!currentUser) {
      Alert.alert("Error", "Sesión no válida.");
      return;
    }

    let finalPacienteId = "";
    let finalMedicoId = "";
    const role = parseInt(currentUser.role);

    if (role === 0 || role === 2) {
      finalPacienteId = pacienteSeleccionado;
      finalMedicoId = medicoSeleccionado;
    } else if (role === 1) {
      finalPacienteId = pacienteSeleccionado;
      finalMedicoId = currentUser._id;
    } else if (role === 3) {
      finalPacienteId = currentUser._id;
      finalMedicoId = medicoSeleccionado;
    }

    if (!fecha || !hora || !finalPacienteId || !finalMedicoId || !motivo) {
      Alert.alert("Error", "Por favor completa todos los campos requeridos.");
      return;
    }

    const finalStatus = (role === 1 || role === 2) ? "confirmada" : "pendiente";

    setIsLoading(true);
  
    try {
      const [h, m] = hora.split(':');
      const finalDate = new Date(dateObject);
      finalDate.setHours(parseInt(h), parseInt(m), 0);

      const appointmentData = {
        paciente_id: finalPacienteId,
        medico_id: finalMedicoId,
        fecha_hora: finalDate.toISOString(),
        status: finalStatus,
        motivo: motivo.trim(),
      };

      console.log("\n OBJETO A ENVIAR SEGÚN ROL (" + role + "):");
      console.log(JSON.stringify(appointmentData, null, 2));

      const response = await api.post('/appointments/createAppointments', appointmentData);

      Alert.alert("Éxito", response.data.msg || "Cita agendada con éxito");

      setFecha("");
      setHora("");
      setMedicoSeleccionado("");
      setPacienteSeleccionado("");
      setMotivo("");
      setDateObject(new Date());

      return true;

    } catch (error) {
      console.error("Error en la petición:", error.response?.data);
      Alert.alert("Error", error.response?.data?.msg || "No se pudo agendar.");
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
    pacientes,
    pacienteSeleccionado,
    setPacienteSeleccionado,
    motivo,
    setMotivo,
    showPicker,
    setShowPicker,
    dateObject,
    onChangePicker,
    handleCreateAppointment,
    isLoading,
    currentUser
  };
};

export default useCreateAppointment;