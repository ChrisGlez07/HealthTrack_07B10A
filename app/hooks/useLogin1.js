import { useState } from "react";
import { Alert } from "react-native";
import StorageService from "../helpers/StorageService";

const useLogin1 = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    // Validaciones
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
      // Simular llamada API - Aquí iría tu fetch real
      // const response = await fetch('https://tu-api.com/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password })
      // });
      // const data = await response.json();

      // Simulación de respuesta exitosa
      const mockToken = "mock-jwt-token-12345";
      const mockUserData = {
        id: "1",
        email: email,
        name: "Usuario Ejemplo"
      };

      // Guardar token en SecureStore
      await StorageService.saveToken("userToken", mockToken);
      await StorageService.setItem("userData", mockUserData);
      await StorageService.setItem("lastEmail", email);

      Alert.alert("Success", "Login successful!");
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "An error occurred during login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await StorageService.resetToken("userToken");
      await StorageService.setItem("userData", null);
      Alert.alert("Success", "Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const checkLoginStatus = async () => {
    try {
      const token = await StorageService.getToken("userToken");
      const userData = await StorageService.getItem("userData");
      
      if (token && userData) {
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error checking login status:", error);
      return false;
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    handleLogin,
    logout,
    checkLoginStatus,
    isLoading
  };
};

export default useLogin1;