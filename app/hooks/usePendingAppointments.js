import { useEffect, useState } from "react";
import api from "../models/users";

const usePendingAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPendingAppointments = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/appointments/getPendingAppointments');
      const data = response.data.pendientes || response.data;
      setAppointments(Array.isArray(data) ? data : []);
    } catch (error) {
      setAppointments([]); 
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmAppointment = async (id) => {
    if (!id) {
      console.error("ID no válido, abortando para evitar Error 500");
      return;
    }

    setIsLoading(true);
    try {
      await api.patch(`/appointments/updateAppointmentStatus/${id}`, {
        nuevoEstado: 'confirmada'
      });
      alert("Cita confirmada");
      await fetchPendingAppointments();
    } catch (error) {
      console.error("Fallo al confirmar:", error.response?.data || error.message);
      alert("Error en el servidor al confirmar");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingAppointments();
  }, []);

  return { appointments, isLoading, handleConfirmAppointment, refresh: fetchPendingAppointments };
};

export default usePendingAppointments;