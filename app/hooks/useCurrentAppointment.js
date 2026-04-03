import { useEffect, useState } from "react";
import { Alert } from "react-native";
import api from "../models/users";

const useCurrentAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllAppointments = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Llamada a la API real
      const response = await api.get('/appointments/getAllAppointments');
      
      // Asumiendo que la respuesta tiene la estructura con los datos
      const allAppointments = response.data.data || response.data || [];
      
      setAppointments(allAppointments);
      
      // Filtrar solo citas con status pendiente o confirmada
      const activeAppointments = allAppointments.filter(
        appointment => appointment.status === "pendiente" || appointment.status === "confirmada"
      );
      setFilteredAppointments(activeAppointments);
      
    } catch (error) {
      console.error("Error al obtener citas:", error);
      const errorMessage = error.response?.data?.message || error.message || "Error al cargar las citas";
      setError(errorMessage);
      Alert.alert("Error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para solicitar cancelación de cita (status pendiente_aprobacion)
  const handleCancelacion = async (appointmentId, motivoCancelacion) => {
    if (!motivoCancelacion || motivoCancelacion.trim() === "") {
      Alert.alert("Error", "Debe proporcionar un motivo para la cancelación");
      return false;
    }

    setIsLoading(true);
    
    try {
      // Actualizar el status a pendiente_aprobacion
      const response = await api.patch(`/appointments/updateAppointment/${appointmentId}`, {
        status: "pendiente_aprobacion",
        cancelacion: {
          motivo: motivoCancelacion,
          fechaSolicitud: new Date().toISOString()
          // solicitadoPor se manejaría desde el backend con el token del usuario
        }
      });
      
      // Actualizar el estado local después de la actualización exitosa
      await fetchAllAppointments(); // Refrescar datos
      
      Alert.alert("Éxito", "Solicitud de cancelación enviada. Esperando aprobación.");
      return true;
      
    } catch (error) {
      console.error("Error al solicitar cancelación:", error);
      const errorMessage = error.response?.data?.message || "Error al procesar la solicitud de cancelación";
      Alert.alert("Error", errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Función para actualizar el status de una cita (genérica)
  const updateAppointmentStatus = async (appointmentId, newStatus, additionalData = {}) => {
    setIsLoading(true);
    
    try {
      const payload = { status: newStatus, ...additionalData };
      const response = await api.patch(`/appointments/updateAppointment/${appointmentId}`, payload);
      
      // Actualizar el estado local después de la actualización exitosa
      await fetchAllAppointments();
      
      return true;
      
    } catch (error) {
      console.error("Error al actualizar cita:", error);
      const errorMessage = error.response?.data?.message || "Error al actualizar la cita";
      Alert.alert("Error", errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Función para refrescar los datos
  const refresh = () => {
    fetchAllAppointments();
  };

  useEffect(() => {
    fetchAllAppointments();
  }, []);

  return { 
    appointments,          // Todas las citas sin filtrar
    filteredAppointments, // Solo citas pendientes y confirmadas
    isLoading, 
    error,
    updateAppointmentStatus,
    handleCancelacion,    // Nueva función específica para cancelación
    refresh 
  };
};

export default useCurrentAppointment;