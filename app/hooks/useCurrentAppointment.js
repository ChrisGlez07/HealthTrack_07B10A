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
      console.log(" Obteniendo citas del backend...");

      const response = await api.get('/appointments/getAllAppointments');

      console.log(" Respuesta COMPLETA de la API:");
      console.log("Status:", response.status);
      console.log("Data:", JSON.stringify(response.data, null, 2));

      let allAppointments = [];

      if (response.data && Array.isArray(response.data.pendientes)) {
        allAppointments = response.data.pendientes;
        console.log(` Encontradas ${allAppointments.length} citas pendientes`);
      } else if (response.data && Array.isArray(response.data.confirmadas)) {
        allAppointments = [...allAppointments, ...response.data.confirmadas];
        console.log(` Agregadas ${response.data.confirmadas.length} citas confirmadas`);
      } else if (response.data && typeof response.data === 'object') {
        Object.keys(response.data).forEach(key => {
          if (Array.isArray(response.data[key])) {
            allAppointments = [...allAppointments, ...response.data[key]];
            console.log(` Agregadas ${response.data[key].length} citas de la categoría: ${key}`);
          }
        });
      } else if (Array.isArray(response.data)) {
        allAppointments = response.data;
        console.log(" response.data es un array directo");
      }

      if (!Array.isArray(allAppointments)) {
        console.error("❌ No se pudo obtener un array de citas");
        throw new Error("La respuesta del servidor no contiene un array de citas");
      }

      console.log(` Total de citas recibidas: ${allAppointments.length}`);

      if (allAppointments.length > 0) {
        console.log(" Ejemplo de cita:", JSON.stringify(allAppointments[0], null, 2));
      }

      setAppointments(allAppointments);

      const activeAppointments = allAppointments.filter(
        appointment => appointment.status === "pendiente" || appointment.status === "confirmada"
      );

      console.log(` Citas activas (pendiente/confirmada): ${activeAppointments.length}`);

      setFilteredAppointments(activeAppointments);

    } catch (error) {
      console.error(" Error al obtener citas:", error);

      let errorMessage = "Error al cargar las citas";

      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.msg) {
          errorMessage = error.response.data.msg;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
      Alert.alert("Error", errorMessage);

      setAppointments([]);
      setFilteredAppointments([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para solicitar cancelación de cita
  const handleCancelacion = async (appointmentId, motivoCancelacion) => {
    if (!motivoCancelacion || motivoCancelacion.trim() === "") {
      Alert.alert("Error", "Debe proporcionar un motivo para la cancelación");
      return false;
    }

    setIsLoading(true);

    try {
      console.log(` Solicitando cancelación para cita: ${appointmentId}`);
      console.log(` Motivo: ${motivoCancelacion}`);

      //Enviar solo el status y el motivo dentro de cancelacion
      const payload = {
        motivo: motivoCancelacion.trim()
      };

      console.log(" Payload a enviar:", JSON.stringify(payload, null, 2));
      console.log(" URL:", `/appointments/requestCancellation/${appointmentId}`);

      const response = await api.patch(`/appointments/requestCancellation/${appointmentId}`, payload);

      console.log(" Respuesta cancelación:", response.data);

      // Refrescar datos después de la actualización exitosa
      await fetchAllAppointments();

      Alert.alert("Éxito", response.data.message || "Solicitud de cancelación enviada. Esperando aprobación.");
      return true;

    } catch (error) {
      console.error(" Error al solicitar cancelación:", error);
      console.error("Error response:", error.response?.data);
      console.error("Status code:", error.response?.status);

      let errorMessage = "Error al procesar la solicitud de cancelación";
      if (error.response?.data?.msg) {
        errorMessage = error.response.data.msg;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 404) {
        errorMessage = "No se encontró la cita. Por favor intenta de nuevo.";
      } else if (error.response?.status === 403) {
        errorMessage = "No tienes permiso para cancelar esta cita.";
      }

      Alert.alert("Error", errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Función para actualizar el status de una cita
  const updateAppointmentStatus = async (appointmentId, newStatus, additionalData = {}) => {
    setIsLoading(true);

    try {
      console.log(` Actualizando cita ${appointmentId} a status: ${newStatus}`);

      const payload = { status: newStatus, ...additionalData };
      console.log("Payload:", JSON.stringify(payload, null, 2));

      const response = await api.patch(`/appointments/updateAppointment/${appointmentId}`, payload);

      console.log(" Respuesta actualización:", response.data);

      await fetchAllAppointments();

      return true;

    } catch (error) {
      console.error(" Error al actualizar cita:", error);

      let errorMessage = "Error al actualizar la cita";
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

  const refresh = () => {
    fetchAllAppointments();
  };

  useEffect(() => {
    fetchAllAppointments();
  }, []);

  return {
    appointments,
    filteredAppointments,
    isLoading,
    error,
    updateAppointmentStatus,
    handleCancelacion,
    refresh
  };
};

export default useCurrentAppointment;