import { Picker } from '@react-native-picker/picker'; // Importación necesaria
import { useRouter } from "expo-router";
import { ActivityIndicator, Button, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import useRegisterMedic from "../hooks/useRegisterMedic";

const RegisterMedic = () => {
  const router = useRouter(); 

  const { 
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
  } = useRegisterMedic();

  const especialidadesValidas = [
    'Cardiología', 
    'Pediatría', 
    'Reumatología', 
    'General', 
    'Ginecología', 
    'Jefe'
  ];

  const onRegisterPress = async () => {
    await handleRegister();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.TextInput}>Usuario:</Text>
      <TextInput 
        style={styles.inputText} 
        value={username} 
        onChangeText={setUsername} 
        editable={!isLoading} 
      />

      <Text style={styles.TextInput}>Email:</Text>
      <TextInput 
        style={styles.inputText} 
        value={email} 
        onChangeText={setEmail} 
        keyboardType="email-address" 
        editable={!isLoading} 
      />
      
      <Text style={styles.TextInput}>Cédula Interna:</Text>
      <TextInput 
        style={styles.inputText} 
        value={cedulaInterna} 
        onChangeText={setCedulaInterna} 
        editable={!isLoading} 
      />

      <Text style={styles.TextInput}>Especialidad:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={especialidad}
          onValueChange={(itemValue) => setEspecialidad(itemValue)}
          enabled={!isLoading}
          style={styles.picker}
        >
          <Picker.Item label="Seleccione especialidad..." value="" color="#999" />
          {especialidadesValidas.map((esp) => (
            <Picker.Item key={esp} label={esp} value={esp} />
          ))}
        </Picker>
      </View>

      <Text style={styles.TextInput}>Password:</Text>
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
        <View>
          <Button 
            title="Registrar Médico" 
            onPress={onRegisterPress} 
            color="#2196F3"
          />
          <Text 
            style={styles.linkText} 
            onPress={() => router.back()} 
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
  TextInput: { 
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
  // Estilos añadidos para el contenedor del Picker
  pickerContainer: {
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 16,
    justifyContent: 'center',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  linkText: {
    marginTop: 15,
    color: '#2196F3',
    textAlign: 'center',
    textDecorationLine: 'underline',
  }
});

export default RegisterMedic;