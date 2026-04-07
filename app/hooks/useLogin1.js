//Final App

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
    { id: "1", username: "admin_sistema", email: "admin@heal.com", password: "Admin123456", role: 0, especialidad: "Dirección" },
    { id: "2", username: "dr_cardio", email: "cardiologia@healthtrack.com", password: "Medico123456", role: 1, especialidad: "Cardiología", cedulaInterna: "MED12345" },
    { id: "8", username: "asistente1", email: "asistente1@healthtrack.com", password: "Asistente123456", role: 2, consultorio: 1 },
    { id: "11", username: "paciente1", email: "paciente1@healthtrack.com", password: "Paciente123456", role: 3 }
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
        email: email.trim().toLowerCase(),
        password: password.trim()
      };

      const response = await api.post('/login', data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': ''
        }
      });

      const { token, usuario } = response.data;

      if (!usuario) {
        console.log("No se encontró el objeto 'usuario' en:", response.data);
        Alert.alert("Error", "Invalid email or password. Please try again.");
        setIsLoading(false);
        return;
      }

      const userData = {
        _id: usuario._id,
        email: usuario.email,
        username: usuario.username,
        role: usuario.role,
        especialidad: usuario.especialidad !== undefined ? usuario.especialidad : null,
        cedulaInterna: usuario.cedulaInterna !== undefined ? usuario.cedulaInterna : null,
        consultorio: usuario.consultorio !== undefined ? usuario.consultorio : null
      };

      await StorageService.saveToken("userToken", token);
      await StorageService.setItem("userData", userData);
      await StorageService.setItem("lastEmail", email);

      await StorageService.setItem("userRole", usuario.role.toString());

      setUserRole(usuario.role);

      let welcomeMessage = `Welcome ${userData.username}!`;
      if (usuario.role === 0) {
        welcomeMessage = `Welcome Administrator ${userData.username}!`;
      } else if (usuario.role === 1) {
        welcomeMessage = `Welcome Dr. ${userData.username} (${usuario.especialidad || 'General'})!`;
      } else if (usuario.role === 2) {
        welcomeMessage = `Welcome Assistant ${userData.username} (Consultorio ${usuario.consultorio || 'N/A'})!`;
      } else if (usuario.role === 3) {
        welcomeMessage = `Welcome ${userData.username}!`;
      }

      Alert.alert("Success", welcomeMessage);
      router.replace("/components/Menu");

    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
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