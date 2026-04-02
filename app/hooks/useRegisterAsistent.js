//Final App

import { useState } from "react";
import { Alert } from "react-native";
import StorageService from "../helpers/StorageService";
import api from "../models/users";

const useRegisterAsistent = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [consultorio, setConsultorio] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!username.trim() || !email.trim() || !password.trim() || !consultorio.trim()) {
      Alert.alert("Error", "Complete todos los campos, incluyendo el consultorio.");
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
        consultorio: consultorio.trim(), 
        role: 2 
      };
      
      console.log("Enviando Asistente:", payload);

      const response = await api.post('/register/personal', payload);

      setUsername("");
      setEmail("");
      setPassword("");
      setConsultorio(""); 
      
      Alert.alert("Éxito", response.data.msg || "Asistente registrado correctamente.");
      return true;

    } catch (error) {
      console.error(error);
      const serverMsg = error.response?.data?.msg || "Error en el servidor.";
      Alert.alert("Error", serverMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return { 
    username, setUsername, email, setEmail, password, setPassword, 
    consultorio, setConsultorio, handleRegister, isLoading 
  };
};

export default useRegisterAsistent;