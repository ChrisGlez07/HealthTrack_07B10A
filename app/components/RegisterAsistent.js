import { Picker } from '@react-native-picker/picker';
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
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={consultorio}
          onValueChange={(itemValue) => setConsultorio(itemValue)}
          enabled={!isLoading}>
          <Picker.Item label="Consultorio 1" value="1" />
          <Picker.Item label="Consultorio 2" value="2" />
          <Picker.Item label="Consultorio 3" value="3" />
          <Picker.Item label="Consultorio 4" value="4" />
          <Picker.Item label="Consultorio 5" value="5" />
          <Picker.Item label="Consultorio 6" value="6" />
          <Picker.Item label="Consultorio 7" value="7" />
          <Picker.Item label="Consultorio 8" value="8" />
          <Picker.Item label="Consultorio 9" value="9" />
          <Picker.Item label="Consultorio 10" value="10" />
        </Picker>
      </View>
      
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
            onPress={() => router.back()}>Volver atrás</Text>
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 16,
    justifyContent: 'center',
  },
  linkText: {
    marginTop: 15,
    color: '#2196F3',
    textAlign: 'center',
    textDecorationLine: 'underline',
  }
});

export default RegisterAsistent;