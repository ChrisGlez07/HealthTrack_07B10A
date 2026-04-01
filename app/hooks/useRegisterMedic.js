import { useState } from "react";
import { Alert } from "react-native";
import StorageService from "../helpers/StorageService";

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

    if (!StorageService.validate('password', password)) {
      Alert.alert("Error", "Contraseña débil.");
      return;
    }

    setIsLoading(true);
    try {
      // API ENDPOINT:
      const payload = { 
        username, 
        email, 
        password, 
        cedulaInterna, 
        especialidad, 
        role: 1 
      };
      
      console.log("Enviando Médico:", payload);

      const mockToken = "token-medico-rol-1";
      await StorageService.saveToken("userToken", mockToken);
      await StorageService.setItem("userData", { username, email, cedulaInterna, especialidad, role: 1 });
      // -----------------------------------------------

      setUsername("");
      setEmail("");
      setPassword("");
      setCedulaInterna("");
      setEspecialidad("");


      Alert.alert("Éxito", "Médico registrado exitosamente.");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Error al procesar registro.");
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
    cedulaInterna, 
    setCedulaInterna, 
    especialidad, 
    setEspecialidad, 
    handleRegister, 
    isLoading 
  };
};

export default useRegisterMedic;