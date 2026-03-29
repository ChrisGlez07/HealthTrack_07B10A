import { ActivityIndicator, Button, StyleSheet, Text, TextInput, View } from "react-native";
import useRegister from "../hooks/useRegister";

const Register = () => {
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

  return (
    <View style={styles.container}>
      <Text style={styles.textcommon}>Usuario:</Text>
      <TextInput 
        style={styles.inputText}
        value={username}
        onChangeText={setUsername}
        placeholder="Nombre de usuario"
        editable={!isLoading}
      />

      <Text style={styles.textcommon}>Email:</Text>
      <TextInput 
        style={styles.inputText}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!isLoading}
      />
      
      <Text style={styles.textcommon}>Contraseña:</Text>
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
        <Button 
          title="Crear Cuenta" 
          onPress={handleRegister}
          color="#2196F3"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  textcommon: {
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
    fontWeight: 'bold',
    height: 40,
    marginBottom: 16,
  }
});

export default Register;