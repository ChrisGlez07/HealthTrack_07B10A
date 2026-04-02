import { Picker } from '@react-native-picker/picker';
import { useRouter } from "expo-router";
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
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
      <View style={styles.headerContainer}>
        <Image 
          source={require('../assets/HealthTrack.png')} 
          style={styles.logoImage} 
          resizeMode="contain" 
        />
      </View>

      <Text style={styles.title}>REGISTRAR MÉDICO</Text>

      <View style={styles.formCard}>
        <TextInput 
          style={styles.inputText} 
          value={username} 
          onChangeText={setUsername} 
          placeholder="USUARIO"
          placeholderTextColor="#999"
          editable={!isLoading} 
        />

        <TextInput 
          style={styles.inputText} 
          value={email} 
          onChangeText={setEmail} 
          keyboardType="email-address" 
          placeholder="EMAIL"
          placeholderTextColor="#999"
          editable={!isLoading} 
        />
        
        <TextInput 
          style={styles.inputText} 
          value={cedulaInterna} 
          onChangeText={setCedulaInterna} 
          placeholder="CÉDULA INTERNA"
          placeholderTextColor="#999"
          editable={!isLoading} 
        />

        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={especialidad}
            onValueChange={(itemValue) => setEspecialidad(itemValue)}
            enabled={!isLoading}
            style={styles.pickerComponent}
            dropdownIconColor="#999"
          >
            <Picker.Item label="Seleccione especialidad..." value="" color="#999" />
            {especialidadesValidas.map((esp) => (
              <Picker.Item key={esp} label={esp} value={esp} />
            ))}
          </Picker>
        </View>

        <TextInput 
          style={styles.inputText} 
          value={password} 
          onChangeText={setPassword} 
          secureTextEntry={true}
          placeholder="PASSWORD"
          placeholderTextColor="#999"
          editable={!isLoading} 
        />
      </View>
      
      <View style={styles.buttonSection}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#a2d2ff" />
        ) : (
          <>
            <TouchableOpacity style={styles.primaryButton} onPress={onRegisterPress}>
              <Text style={styles.buttonText}>SAVE</Text> 
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton} onPress={() => router.back()}>
              <Text style={styles.buttonText}>BACK TO LOGIN</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flexGrow: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  headerContainer: {
    width: '90%',
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    padding: 10,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 22,
    fontWeight: '400',
    marginBottom: 20,
    letterSpacing: 1,
    color: '#000',
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: '#e8ecf8',
    width: '90%',
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#2ACFB3',
    marginBottom: 30,
  },
  inputText: { 
    backgroundColor: '#fff',
    height: 50, 
    borderRadius: 25,
    paddingHorizontal: 20,
    marginBottom: 15,
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  pickerWrapper: {
    backgroundColor: '#fff',
    borderRadius: 25,
    height: 50,
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: 15,
  },
  pickerComponent: {
    width: '100%',
    height: 50,
  },
  buttonSection: {
    width: '75%',
  },
  primaryButton: {
    backgroundColor: '#e1e8f9',
    paddingVertical: 14,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#2ACFB3',
    marginBottom: 15,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: '#e1e8f9',
    paddingVertical: 14,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#2ACFB3',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#444',
    letterSpacing: 1.5,
  },
});

export default RegisterMedic;