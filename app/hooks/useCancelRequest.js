//Final App

import { useEffect, useState } from "react";
import api from "../models/users";

const useCancelRequest = () => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCancelAppointments = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/appointments/getPendingCancellations');
      const data = response.data.pendiente_aprobacion || response.data;
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
        nuevoEstado: 'cancelada'
      });
      alert("Cita cancelada");
      await fetchCancelAppointments();
    } catch (error) {
      console.error("Fallo al cancelar:", error.response?.data || error.message);
      alert("Error en el servidor al cancelar la cita");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCancelAppointments();
  }, []);

  return { appointments, isLoading, handleConfirmAppointment, refresh: fetchCancelAppointments };
};

export default useCancelRequest;