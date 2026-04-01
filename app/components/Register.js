import { useRouter } from "expo-router";
import { ActivityIndicator, Button, StyleSheet, Text, TextInput, View } from "react-native";
import useRegister from "../hooks/useRegister";

const Register = () => {
  const router = useRouter(); 
  
  const {
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    handleRegister,
    isLoading
  } = useRegister();

  const onRegisterPress = async () => {
    const success = await handleRegister();

    if (success) {
      router.replace("/"); 
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.TextInput}>Usuario:</Text>
      <TextInput 
        style={styles.inputText}
        value={username}
        onChangeText={setUsername}
        placeholder="Nombre de usuario"
        editable={!isLoading}
      />

      <Text style={styles.TextInput}>Email:</Text>
      <TextInput 
        style={styles.inputText}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!isLoading}
      />
      
      <Text style={styles.TextInput}>Contraseña:</Text>
      <TextInput 
        style={styles.inputText}
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
        editable={!isLoading}
      />
      
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View style={styles.buttonContainer}>
          <Button 
            title="Crear Cuenta" 
            onPress={onRegisterPress}
            color="#2196F3"
          />
          <Text 
            style={styles.linkText} 
            onPress={() => router.back()} // Boton de prueba para volver
          >
            ¿Ya tienes cuenta? Inicia sesión
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: '#f5f5f5', 
  },
  TextInput: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  inputText: {
    fontSize: 16,
    borderWidth: 1,
    padding: 8,
    borderColor: 'gray',
    color: 'black',
    backgroundColor: 'white',
    height: 40,
    marginBottom: 16,
    borderRadius: 5,
  },
  buttonContainer: {
    marginTop: 10,
  },
  linkText: {
    marginTop: 15,
    color: '#2196F3',
    textAlign: 'center',
    textDecorationLine: 'underline',
  }
});

export default Register;