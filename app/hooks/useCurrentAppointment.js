//Final App

import { useEffect, useState } from "react";
import { Alert } from "react-native";
import StorageService from "../helpers/StorageService";
import api from "../models/users";

const useCurrentAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("activas");

  const [currentUser, setCurrentUser] = useState(null);

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
      //Respuesta 
      if (response.data && typeof response.data === 'object') {

        // Con esto proceso la respuesta .pendientes
        if (Array.isArray(response.data.pendientes)) {
          allAppointments = [...allAppointments, ...response.data.pendientes];
          console.log(` Agregadas ${response.data.pendientes.length} citas pendientes`);
        }

        // Con esto proceso la respuesta .confirmadas
        if (Array.isArray(response.data.confirmadas)) {
          allAppointments = [...allAppointments, ...response.data.confirmadas];
          console.log(` Agregadas ${response.data.confirmadas.length} citas confirmadas`);
        }

        // Con esto proceso la respuesta .canceladas
        if (Array.isArray(response.data.canceladas)) {
          allAppointments = [...allAppointments, ...response.data.canceladas];
          console.log(` Agregadas ${response.data.canceladas.length} citas canceladas`);
        }

      } else if (Array.isArray(response.data)) {
        // Si la respuesta es directamente un array
        allAppointments = response.data;
        console.log(" response.data es un array directo");
      }

      if (!Array.isArray(allAppointments)) {
        console.error(" No se pudo obtener un array de citas");
        throw new Error("La respuesta del servidor no contiene un array de citas");
      }

      console.log(` Total de citas recibidas: ${allAppointments.length}`);

      // Estadísticas por estado
      const stats = {
        pendiente: allAppointments.filter(a => a.status === "pendiente").length,
        confirmada: allAppointments.filter(a => a.status === "confirmada").length,
        cancelada: allAppointments.filter(a => a.status === "cancelada").length,
      };
      console.log(" Estadísticas:", stats);

      if (allAppointments.length > 0) {
        console.log(" Ejemplo de cita:", JSON.stringify(allAppointments[0], null, 2));
      }

      setAppointments(allAppointments);

      //soo aplicar filtro activo
      applyFilter(allAppointments, activeFilter);

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

  // Función para aplicar filtros
  const applyFilter = (appointmentsList, filterType) => {
    if (!appointmentsList || !Array.isArray(appointmentsList)) {
      setFilteredAppointments([]);
      return;
    }

    let filtered = [];

    switch (filterType) {
      case "activas":
        filtered = appointmentsList.filter(
          app => app.status === "pendiente" || app.status === "confirmada" 
        );
        break;
      case "pendientes":
        filtered = appointmentsList.filter(
          app => app.status === "pendiente"
        );
        break;
      case "confirmadas":
        filtered = appointmentsList.filter(
          app => app.status === "confirmada"
        );
        break;
      case "canceladas":
        filtered = appointmentsList.filter(
          app => app.status === "cancelada" || app.status === "rechazada"
        );
        break;
      case "todas":
        filtered = [...appointmentsList];
        break;
      default:
        filtered = appointmentsList.filter(
          app => app.status === "pendiente" || app.status === "confirmada"
        );
    }

    console.log(`🔍 Filtro aplicado: ${filterType} -> ${filtered.length} citas`);
    setFilteredAppointments(filtered);
  };

  // Cambiar filtro activo
  const changeFilter = (newFilter) => {
    setActiveFilter(newFilter);
    applyFilter(appointments, newFilter);
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

      const payload = {
        motivo: motivoCancelacion.trim()
      };
//payload para a;adir id de citas en endpoint de cancelacion
      console.log(" Payload a enviar:", JSON.stringify(payload, null, 2));
      console.log(" URL:", `/appointments/requestCancellation/${appointmentId}`);

      const response = await api.patch(`/appointments/requestCancellation/${appointmentId}`, payload);

      console.log(" Respuesta cancelación:", response.data);

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
      console.log(" Payload:", JSON.stringify(payload, null, 2));

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
    const loadUserData = async () => {
      const userData = await StorageService.getItem("userData");
      setCurrentUser(userData);
    };
    loadUserData();
    fetchAllAppointments();
  }, []);

  return {
    appointments,
    filteredAppointments,
    isLoading,
    error,
    activeFilter,
    currentUser,
    changeFilter,
    updateAppointmentStatus,
    handleCancelacion,
    refresh
  };
};

export default useCurrentAppointment;