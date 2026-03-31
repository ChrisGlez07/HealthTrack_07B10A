import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import StorageService from "../helpers/StorageService";

const useMenu = () => {
  const [userData, setUserData] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const allOptions = [
    {
      id: 1,
      name: "CancelRequest",
      title: "Cancel Request",
      icon: require("../assets/cancel_request.png"),
      route: "/components/CancelRequest",
    },
    {
      id: 2,
      name: "CreateAppointment",
      title: "Create Appointment",
      icon: require("../assets/create_appointment.png"),
      route: "/components/CreateAppointment",
    },
    {
      id: 3,
      name: "CurrentAppointment",
      title: "Current Appointment",
      icon: require("../assets/current_appointment.png"),
      route: "/components/CurrentAppointment",
    },
    {
      id: 4,
      name: "LastAppointment",
      title: "Last Appointment",
      icon: require("../assets/last_appointment.png"),
      route: "/components/LastAppointment",
    },
    {
      id: 5,
      name: "RegisterAsistent",
      title: "Register Assistant",
      icon: require("../assets/register_asistent.png"),
      route: "/components/RegisterAsistent",
    },
    {
      id: 6,
      name: "RegisterMedic",
      title: "Register Medic",
      icon: require("../assets/register_medic.png"),
      route: "/components/RegisterMedic",
    }
  ];

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const user = await StorageService.getItem("userData");
      const role = await StorageService.getItem("userRole");
      
      if (user) {
        setUserData(user);
        setUserRole(role ? parseInt(role) : null);
      } else {
        router.replace("/");
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // MODIFICADO: Ahora devuelve TODAS las opciones sin filtrar
  const getFilteredOptions = () => {
    return allOptions; // Devuelve todas las opciones sin importar el rol
  };

  const handleLogout = async () => {
    try {
      await StorageService.resetToken("userToken");
      await StorageService.setItem("userData", null);
      await StorageService.setItem("userRole", null);
      router.replace("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const navigateTo = (route) => {
    router.push(route);
  };

  const getUserRoleName = () => {
    switch(userRole) {
      case 0: return "Administrator";
      case 1: return "Medic";
      case 2: return "Assistant";
      case 3: return "Patient";
      default: return "User";
    }
  };

  return {
    userData,
    userRole,
    isLoading,
    filteredOptions: getFilteredOptions(), // Ahora devuelve todas las opciones
    handleLogout,
    navigateTo,
    getUserRoleName
  };
};

export default useMenu;