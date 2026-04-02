import { useEffect, useState } from "react";

const usePendingAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPendingAppointments = async () => {
    setIsLoading(true);
    try {
      // (GET): /api/appointments/getPendingAppointments
      /* const response = await fetch('URL/api/appointments/getPendingAppointments', {
          headers: { 'Authorization': `Bearer ${mockToken}` }
      });
      const data = await response.json(); 
      */

      const mockData = [
        { id: 101, paciente_id: "Juan Pérez", motivo: "Dolor abdominal", fecha_hora: "05-04-2024 09:00", status: "pendiente" },
        { id: 102, paciente_id: "Maria Garcia", motivo: "Revision Dental", fecha_hora: "05-04-2024 11:30", status: "pendiente" },
        { id: 103, paciente_id: "Ricardo Sosa", motivo: "Migraña crónica", fecha_hora: "06-04-2024 10:00", status: "pendiente" },
      ];

      setAppointments(mockData);
    } catch (error) {
      console.error("Error al obtener citas pendientes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmAppointment = async (id) => {
    setIsLoading(true);
    try {
      console.log("Confirmando cita ID:", id);
      
      //(PATCH): /api/appointments/updateAppointmentStatus/{id}
      // BODY: { "nuevoEstado": "confirmada" }
      /*
      const response = await fetch(`URL/api/appointments/updateAppointmentStatus/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nuevoEstado: 'confirmada' })
      });
      const result = await response.json();
      */

      alert(`Cita ${id} confirmada con éxito.`);
      
      await fetchPendingAppointments();
    } catch (error) {
      console.error("Error al confirmar cita:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingAppointments();
  }, []);

  return { 
    appointments, 
    isLoading, 
    handleConfirmAppointment, 
    refresh: fetchPendingAppointments 
  };
};

export default usePendingAppointments;