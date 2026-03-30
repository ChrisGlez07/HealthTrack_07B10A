import { useEffect, useState } from "react";

const useLastAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllAppointments = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // TODO: Reemplazar URL cuando esté disponible
      // const token = localStorage.getItem('token'); // O como manejen el token
      // const response = await fetch('URL/api/appointments/getAllAppointments', {
      //   method: 'GET',
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //     'Content-Type': 'application/json',
      //   },
      // });
      // const data = await response.json();
      
      // Mock data para desarrollo
      const mockData = [
        { 
          id: 1, 
          paciente_id: "Memo", 
          medico_id: "Dr. García",
          fecha_hora: "2024-03-28T10:00:00", 
          status: "cancelada", 
          motivo: "Agruras Persistentes" 
        },
        { 
          id: 2, 
          paciente_id: "Alondra", 
          medico_id: "Dra. Martínez",
          fecha_hora: "2024-03-29T15:30:00", 
          status: "completada", 
          motivo: "Chequeo médico" 
        },
        { 
          id: 3, 
          paciente_id: "Chino", 
          medico_id: "Dr. Rodríguez",
          fecha_hora: "2024-03-30T09:00:00", 
          status: "cancelada", 
          motivo: "Cirugía menor en la rodilla" 
        },
        { 
          id: 4, 
          paciente_id: "Sofia", 
          medico_id: "Dra. López",
          fecha_hora: "2024-03-25T14:00:00", 
          status: "completada", 
          motivo: "Consulta general" 
        },
        { 
          id: 5, 
          paciente_id: "Carlos", 
          medico_id: "Dr. Sánchez",
          fecha_hora: "2024-03-20T11:30:00", 
          status: "completada", 
          motivo: "Dolor de cabeza" 
        },
        { 
          id: 6, 
          paciente_id: "Laura", 
          medico_id: "Dra. Pérez",
          fecha_hora: "2024-03-15T16:00:00", 
          status: "cancelada", 
          motivo: "Revisión dental" 
        },
      ];

      setAppointments(mockData);
      
      // Filtrar solo citas con status cancelada o completada
      const completedOrCancelledAppointments = mockData.filter(
        appointment => appointment.status === "cancelada" || appointment.status === "completada"
      );
      setFilteredAppointments(completedOrCancelledAppointments);
      
    } catch (error) {
      console.error("Error al obtener citas:", error);
      setError(error.message || "Error al cargar las citas");
    } finally {
      setIsLoading(false);
    }
  };

  // Función para actualizar el status de una cita (opcional)
  const updateAppointmentStatus = (appointmentId, newStatus) => {
    setAppointments(prevAppointments =>
      prevAppointments.map(appointment =>
        appointment.id === appointmentId
          ? { ...appointment, status: newStatus }
          : appointment
      )
    );
    
    // Actualizar también el filtrado
    setFilteredAppointments(prevFiltered =>
      prevFiltered
        .map(appointment =>
          appointment.id === appointmentId
            ? { ...appointment, status: newStatus }
            : appointment
        )
        .filter(
          appointment => appointment.status === "cancelada" || appointment.status === "completada"
        )
    );
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
    filteredAppointments, // Solo citas canceladas y completadas
    isLoading, 
    error,
    updateAppointmentStatus,
    refresh 
  };
};

export default useLastAppointment;