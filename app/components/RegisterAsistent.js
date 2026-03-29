import { useRouter } from "expo-router";
import { ActivityIndicator, Button, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import useRegisterAsistent from "../hooks/useRegisterAsistent";

const RegisterAsistent = () => {
  const router = useRouter(); 

  const { 
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
  } = useRegisterAsistent();

  const onRegisterPress = async () => {
    await handleRegister();
    // Ejemplo: router.replace("/success");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.textregister}>Usuario:</Text>
      <TextInput 
        style={styles.inputText} 
        value={username} 
        onChangeText={setUsername} 
        editable={!isLoading} 
      />

      <Text style={styles.textregister}>Email:</Text>
      <TextInput 
        style={styles.inputText} 
        value={email} 
        onChangeText={setEmail} 
        keyboardType="email-address" 
        editable={!isLoading} 
      />
      
      <Text style={styles.textregister}>Password:</Text>
      <TextInput 
        style={styles.inputText} 
        value={password} 
        onChangeText={setPassword} 
        secureTextEntry 
        editable={!isLoading} 
      />

      <Text style={styles.textregister}>Consultorio:</Text>
      <TextInput 
        style={styles.inputText} 
        value={consultorio} 
        onChangeText={setConsultorio} 
        placeholder="Consultorio" 
        editable={!isLoading} 
      />
      
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View>
          <Button 
            title="Registrar Asistente" 
            onPress={onRegisterPress} 
            color="#2196F3"
          />
          <Text 
            style={styles.linkText} 
            onPress={() => router.back()} // Boton de prueba para volver atrás
          >
            Volver atrás
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { 
    padding: 20, 
    justifyContent: "center" 
  },
  textregister: { 
    fontSize: 16, 
    color: 'black', 
    fontWeight: 'bold', 
    marginBottom: 8 
  },
  inputText: { 
    fontSize: 16, 
    borderWidth: 1, 
    padding: 8, 
    borderColor: 'gray', 
    height: 40, 
    marginBottom: 16 
  },
  linkText: {
    marginTop: 15,
    color: '#2196F3',
    textAlign: 'center',
    textDecorationLine: 'underline',
  }
});

export default RegisterAsistent;