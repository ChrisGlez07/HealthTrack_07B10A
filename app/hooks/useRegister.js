//Final App

import { useState } from "react";
import { Alert } from "react-native";
import StorageService from "../helpers/StorageService";
import api from "../models/users";

const useRegister = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!username.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }

    if (!StorageService.validate('email', email)) {
      Alert.alert("Error", "Email inválido.");
      return;
    }

    if (!StorageService.validate('password', password)) {
      Alert.alert("Error", "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número.");
      return;
    }

    setIsLoading(true);
    try {
      const payload = { 
        username: username.trim(), 
        email: email.trim().toLowerCase(), 
        password: password.trim()
      };
      
      console.log("Registrando en API:", payload);

      const response = await api.post('/register/paciente', payload);


      Alert.alert("Éxito", response.data.msg || "Usuario registrado correctamente.");

      setUsername("");
      setEmail("");
      setPassword("");

      return true;
      
    } catch (error) {
      console.error("Register error:", error.response?.data || error.message);
      
      const serverMessage = error.response?.data?.msg || 
                           error.response?.data?.message || 
                           "No se pudo completar el registro.";
                           
      Alert.alert("Error", serverMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { 
    username, 
    setUsername, 
    email, 
    setEmail, 
    password, 
    setPassword, 
    handleRegister, 
    isLoading 
  };
};

export default useRegister;