//Final App
import { Picker } from '@react-native-picker/picker';
import { useRouter } from "expo-router";
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
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
      <View style={styles.headerContainer}>
        <Image 
          source={require('../assets/HealthTrack.png')} 
          style={styles.logoImage} 
          resizeMode="contain" 
        />
      </View>

      <Text style={styles.title}>REGISTRAR ASISTENTE</Text>

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
          value={password} 
          onChangeText={setPassword} 
          secureTextEntry 
          placeholder="PASSWORD"
          placeholderTextColor="#999"
          editable={!isLoading} 
        />

        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={consultorio}
            onValueChange={(itemValue) => setConsultorio(itemValue)}
            enabled={!isLoading}
            style={styles.pickerComponent}
          >
            <Picker.Item 
            label="Seleccionar Consultorio" 
            value="" 
            style={{ fontSize: 12, color: '#999' }} 
            />
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
              <Text style={styles.buttonText}>BACK TO MENU</Text>
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
    height: 45,
    borderRadius: 20,
    paddingHorizontal: 20,
    marginBottom: 15,
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  pickerWrapper: {
    backgroundColor: '#fff',
    borderRadius: 20,
    height: 45,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  pickerComponent: {
    width: '100%',
    height: 45,
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

export default RegisterAsistent;