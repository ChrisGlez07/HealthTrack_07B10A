import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";
import StorageService from "../helpers/StorageService";

const useLogin1 = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const router = useRouter();

  const testUsers = [
    {
      id: "1",
      username: "admin_sistema",
      email: "admin@healthtrack.com",
      password: "Admin123!",
      role: 0,
      especialidad: "Dirección",
      name: "Administrador del Sistema"
    },
    {
      id: "2",
      username: "dr_cardio",
      email: "cardiologia@healthtrack.com",
      password: "Medico123!",
      role: 1,
      especialidad: "Cardiología",
      cedulaInterna: "MED12345",
      name: "Dr. Juan Pérez"
    },
    {
      id: "3",
      username: "dra_pediatra",
      email: "pediatria@healthtrack.com",
      password: "Medico123!",
      role: 1,
      especialidad: "Pediatría",
      cedulaInterna: "MED12346",
      name: "Dra. María González"
    },
    {
      id: "4",
      username: "dr_reuma",
      email: "reumatologia@healthtrack.com",
      password: "Medico123!",
      role: 1,
      especialidad: "Reumatología",
      cedulaInterna: "MED12347",
      name: "Dr. Carlos López"
    },
    {
      id: "5",
      username: "dr_general",
      email: "general@healthtrack.com",
      password: "Medico123!",
      role: 1,
      especialidad: "General",
      cedulaInterna: "MED12348",
      name: "Dr. Ana Martínez"
    },
    {
      id: "6",
      username: "dra_gineco",
      email: "ginecologia@healthtrack.com",
      password: "Medico123!",
      role: 1,
      especialidad: "Ginecología",
      cedulaInterna: "MED12349",
      name: "Dra. Laura Sánchez"
    },
    {
      id: "7",
      username: "dr_jefe",
      email: "jefe@healthtrack.com",
      password: "Medico123!",
      role: 1,
      especialidad: "Jefe",
      cedulaInterna: "MED12350",
      name: "Dr. Roberto Fernández"
    },
    {
      id: "8",
      username: "asistente1",
      email: "asistente1@healthtrack.com",
      password: "Asistente123!",
      role: 2,
      consultorio: 1,
      name: "María Rodríguez"
    },
    {
      id: "9",
      username: "asistente2",
      email: "asistente2@healthtrack.com",
      password: "Asistente123!",
      role: 2,
      consultorio: 3,
      name: "Pedro Sánchez"
    },
    {
      id: "11",
      username: "paciente1",
      email: "paciente1@healthtrack.com",
      password: "Paciente123!",
      role: 3,
      name: "Carlos Ramírez"
    },
    {
      id: "12",
      username: "paciente2",
      email: "paciente2@healthtrack.com",
      password: "Paciente123!",
      role: 3,
      name: "Ana López"
    },
  ];

  const handleLogin = async () => {
    if (email.trim() === "" || password.trim() === "") {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }
    
    if (!StorageService.validate('email', email)) {
      Alert.alert("Error", "Please enter a valid email address.");
      return;
    }

    if (!StorageService.validate('password', password)) {
      Alert.alert("Error", "Password must contain at least 8 characters, one uppercase, one lowercase and one number.");
      return;
    }

    setIsLoading(true);

    try {
      const user = testUsers.find(u => u.email === email && u.password === password);
      
      if (!user) {
        Alert.alert("Error", "Invalid email or password. Please try again.");
        setIsLoading(false);
        return;
      }

      const userData = {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        role: user.role,
        especialidad: user.especialidad || null,
        cedulaInterna: user.cedulaInterna || null,
        consultorio: user.consultorio || null
      };

      const mockToken = `mock-jwt-token-${user.id}-${Date.now()}`;

      await StorageService.saveToken("userToken", mockToken);
      await StorageService.setItem("userData", userData);
      await StorageService.setItem("lastEmail", email);
      await StorageService.setItem("userRole", user.role.toString());

      setUserRole(user.role);
      

      let welcomeMessage = `Welcome ${userData.name}!`;
      if (user.role === 0) {
        welcomeMessage = `Welcome Administrator ${userData.name}!`;
      } else if (user.role === 1) {
        welcomeMessage = `Welcome Dr. ${userData.name} (${user.especialidad})!`;
      } else if (user.role === 2) {
        welcomeMessage = `Welcome Assistant ${userData.name} (Consultorio ${user.consultorio})!`;
      } else if (user.role === 3) {
        welcomeMessage = `Welcome ${userData.name}!`;
      }
      
      Alert.alert("Success", welcomeMessage);
      
      router.replace("/menu");
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "An error occurred during login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = () => {
    router.push("/register");
  };

  const logout = async () => {
    try {
      await StorageService.resetToken("userToken");
      await StorageService.setItem("userData", null);
      await StorageService.setItem("userRole", null);
      Alert.alert("Success", "Logged out successfully");
      router.replace("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const checkLoginStatus = async () => {
    try {
      const token = await StorageService.getToken("userToken");
      const userData = await StorageService.getItem("userData");
      const userRole = await StorageService.getItem("userRole");
      
      if (token && userData) {
        setUserRole(userRole ? parseInt(userRole) : null);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error checking login status:", error);
      return false;
    }
  };

  const getUserRole = async () => {
    const role = await StorageService.getItem("userRole");
    return role ? parseInt(role) : null;
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    handleLogin,
    logout,
    checkLoginStatus,
    handleRegister,
    isLoading,
    userRole,
    getUserRole
  };
};

export default useLogin1;