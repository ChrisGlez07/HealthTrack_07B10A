import { useState } from "react";
import { Alert } from "react-native";
import StorageService from "../helpers/StorageService";

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
        consultorio, 
        role: 2 
      };
      
      console.log("Enviando Asistente:", payload);

      const mockToken = "token-asistente-rol-2";
      await StorageService.saveToken("userToken", mockToken);
      await StorageService.setItem("userData", { username, email, consultorio, role: 2 });
      // -----------------------------------------------
      
      setUsername("");
      setEmail("");
      setPassword("");
      setConsultorio(""); 
      
      Alert.alert("Éxito", "Asistente registrado correctamente.");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Error en el servidor.");
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
    consultorio, 
    setConsultorio, 
    handleRegister, 
    isLoading 
  };
};

export default useRegisterAsistent;