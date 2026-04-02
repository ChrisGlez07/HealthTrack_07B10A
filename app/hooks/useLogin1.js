import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";
import StorageService from "../helpers/StorageService";
import api from "../models/users";

const useLogin1 = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const router = useRouter();

  // MOCK DATA COMENTADO
  /*
  const testUsers = [
    {
      id: "1",
      username: "admin_sistema",
      email: "admin@heal.com",
      password: "Admin123456",
      role: 0,
      especialidad: "Dirección",
    },
    {
      id: "2",
      username: "dr_cardio",
      email: "cardiologia@healthtrack.com",
      password: "Medico123456",
      role: 1,
      especialidad: "Cardiología",
      cedulaInterna: "MED12345",
    },
    {
      id: "8",
      username: "asistente1",
      email: "asistente1@healthtrack.com",
      password: "Asistente123456",
      role: 2,
      consultorio: 1,
    },
    {
      id: "11",
      username: "paciente1",
      email: "paciente1@healthtrack.com",
      password: "Paciente123456",
      role: 3,
    },
  ];
  */

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
      const data = {
        email: email,
        password: password
      };

      // Petición real a la API
      const response = await api.post('/login', data);
      
      /* Lógica anterior con Mock Data (Comentada):
        const user = testUsers.find(u => u.email === email && u.password === password);
        if (!user) { ... }
      */

      // Extraemos los datos que vienen del backend
      // Ajusta 'token' y 'user' según los nombres exactos que use tu API
      const { token, user } = response.data;

      if (!user) {
        Alert.alert("Error", "Invalid email or password. Please try again.");
        setIsLoading(false);
        return;
      }

      const userData = {
        _id: user._id || user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        especialidad: user.especialidad || null,
        cedulaInterna: user.cedulaInterna || null,
        consultorio: user.consultorio || null
      };

      await StorageService.saveToken("userToken", token);
      await StorageService.setItem("userData", userData);
      await StorageService.setItem("lastEmail", email);
      await StorageService.setItem("userRole", user.role.toString());

      setUserRole(user.role);

      let welcomeMessage = `Welcome ${userData.username}!`;
      if (user.role === 0) {
        welcomeMessage = `Welcome Administrator ${userData.username}!`;
      } else if (user.role === 1) {
        welcomeMessage = `Welcome Dr. ${userData.username} (${user.especialidad || 'General'})!`;
      } else if (user.role === 2) {
        welcomeMessage = `Welcome Assistant ${userData.username} (Consultorio ${user.consultorio || 'N/A'})!`;
      } else if (user.role === 3) {
        welcomeMessage = `Welcome ${userData.username}!`;
      }
      
      Alert.alert("Success", welcomeMessage);
      router.replace("/components/Menu");

    } catch (error) {
      console.error("Login error:", error);
      const serverMessage = error.response?.data?.message || "An error occurred during login.";
      Alert.alert("Error", serverMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = () => {
    router.push("/components/Register");
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