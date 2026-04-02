//Final App

import { useState } from "react";
import { Alert } from "react-native";
import StorageService from "../helpers/StorageService";
import api from "../models/users";

const useRegisterMedic = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cedulaInterna, setCedulaInterna] = useState("");
  const [especialidad, setEspecialidad] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!username.trim() || !email.trim() || !password.trim() || !cedulaInterna.trim() || !especialidad.trim()) {
      Alert.alert("Error", "Todos los campos son obligatorios para el personal médico.");
      return;
    }

    if (!StorageService.validate('email', email)) {
      Alert.alert("Error", "Email inválido.");
      return;
    }

    const emailParts = email.trim().split("@");
    const domain = emailParts.length > 1 ? emailParts[1] : "";

    if (domain !== "hospitalHealth.com") {
      Alert.alert("Error", "Solo se permiten correos con dominio @hospitalHealth.com");
      return;
    }

    if (!StorageService.validate('password', password)) {
      Alert.alert("Error", "Contraseña débil.");
      return;
    }

    setIsLoading(true);
    try {
      const payload = { 
        username: username.trim(), 
        email: email.trim().toLowerCase(), 
        password: password.trim(), 
        cedulaInterna: cedulaInterna.trim(), 
        especialidad: especialidad.trim(), 
        role: 1 
      };
      
      console.log("Enviando Médico:", payload);

      const response = await api.post('/register/personal', payload);

      setUsername("");
      setEmail("");
      setPassword("");
      setCedulaInterna("");
      setEspecialidad("");

      Alert.alert("Éxito", response.data.msg || "Médico registrado exitosamente.");
      return true;

    } catch (error) {
      console.error(error);
      const serverMsg = error.response?.data?.msg || "Error al procesar registro.";
      Alert.alert("Error", serverMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return { 
    username, setUsername, email, setEmail, password, setPassword,
    cedulaInterna, setCedulaInterna, especialidad, setEspecialidad, 
    handleRegister, isLoading 
  };
};

export default useRegisterMedic;