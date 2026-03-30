import { useEffect, useState } from "react";

const useCurrentAppointment = () => {
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
          paciente_id: "660d5f8e9a3c1a2b4c5d6e7f", 
          medico_id: "670e6a9f8b4d2c3e5f6a7b8c",
          fecha_hora: "2024-03-28T10:00:00", 
          status: "pendiente", 
          motivo: "Agruras Persistentes" 
        },
        { 
          id: 2, 
          paciente_id: "660d5f8e9a3c1a2b4c5d6e80", 
          medico_id: "670e6a9f8b4d2c3e5f6a7b8d",
          fecha_hora: "2024-03-29T15:30:00", 
          status: "confirmada", 
          motivo: "Chequeo médico" 
        },
        { 
          id: 3, 
          paciente_id: "660d5f8e9a3c1a2b4c5d6e81", 
          medico_id: "670e6a9f8b4d2c3e5f6a7b8e",
          fecha_hora: "2024-03-30T09:00:00", 
          status: "cancelada", 
          motivo: "Cirugía menor en la rodilla" 
        },
        { 
          id: 4, 
          paciente_id: "660d5f8e9a3c1a2b4c5d6e82", 
          medico_id: "670e6a9f8b4d2c3e5f6a7b8f",
          fecha_hora: "2024-03-31T14:00:00", 
          status: "completada", 
          motivo: "Consulta general" 
        },
        { 
          id: 5, 
          paciente_id: "660d5f8e9a3c1a2b4c5d6e83", 
          medico_id: "670e6a9f8b4d2c3e5f6a7b90",
          fecha_hora: "2024-04-01T11:30:00", 
          status: "pendiente", 
          motivo: "Dolor de cabeza" 
        },
      ];

      setAppointments(mockData);
      
      // Filtrar solo citas con status pendiente o confirmada
      const activeAppointments = mockData.filter(
        appointment => appointment.status === "pendiente" || appointment.status === "confirmada"
      );
      setFilteredAppointments(activeAppointments);
      
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
          appointment => appointment.status === "pendiente" || appointment.status === "confirmada"
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
    filteredAppointments, // Solo citas pendientes y confirmadas
    isLoading, 
    error,
    updateAppointmentStatus,
    refresh 
  };
};

export default useCurrentAppointment;