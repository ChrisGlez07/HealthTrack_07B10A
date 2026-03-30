import { useState } from "react";
import { Alert } from "react-native";
import StorageService from "../helpers/StorageService";

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
      Alert.alert("Error", "Contraseña débil.");
      return;
    }

    setIsLoading(true);
    try {
      // API ENDPOINT
      const payload = { 
        username, 
        email, 
        password, 
        role: 3 
      };
      
      console.log("Enviando a API:", payload);
      // Simulación de éxito
      await StorageService.saveToken("userToken", "token-user-3");
      Alert.alert("Éxito", "Usuario registrado.");
    } catch {
      Alert.alert("Error", "No se pudo registrar.");
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
    isLoading };
};

export default useRegister;