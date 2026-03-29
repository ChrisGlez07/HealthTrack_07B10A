import { useEffect, useState } from "react";

const useCancelRequests = () => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCancelAppointments = async () => {
    setIsLoading(true);
    try {
      // /api/appointments/getCancelAppointments
      // const response = await fetch('URL/api/appointments/getCancelAppointments');
      // const data = await response.json();

      const mockData = [
        { id: 1, paciente_id: "Memo", motivo: "Agruras Persistentes", fecha_hora: "28-03-2024 10:00", status: "PROCESO DE CANCELACION" },
        { id: 2, paciente_id: "Alondra", motivo: "Chequeo médico", fecha_hora: "29-03-2024 15:30", status: "PROCESO DE CANCELACION" },
        { id: 3, paciente_id: "Chino", motivo: "Cirugía menor en la rodilla", fecha_hora: "30-03-2024 09:00", status: "PROCESO DE CANCELACION" },
      ];

      setAppointments(mockData);
    } catch (error) {
      console.error("Error al obtener citas:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptCancel = async (id) => {
    console.log("Aceptando cancelación de cita ID:", id);
    // POST /api/appointments/CancelAppointments
    alert(`Cancelación aceptada para la cita ${id}`);
    // Recargar lista tras aceptar
    fetchCancelAppointments();
  };

  useEffect(() => {
    fetchCancelAppointments();
  }, []);

  return { 
    appointments, 
    isLoading, 
    handleAcceptCancel, 
    refresh: fetchCancelAppointments };
};

export default useCancelRequests;