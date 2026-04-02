import { useRouter } from "expo-router";
import { ActivityIndicator, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
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
      <View style={styles.headerContainer}>
        <Image 
          source={require('../assets/HealthTrack.png')} 
          style={styles.logoImage} 
          resizeMode="contain" 
        />
      </View>

      <Text style={styles.title}>REGISTRO DE PACIENTE</Text>

      <View style={styles.formCard}>
        <TextInput
          style={styles.inputText}
          value={username}
          onChangeText={setUsername}
          placeholder="USER"
          placeholderTextColor="#999"
          editable={!isLoading}
        />

        <TextInput
          style={styles.inputText}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="EMAIL"
          placeholderTextColor="#999"
          editable={!isLoading}
        />

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  headerContainer: {
    width: '90%',
    height: 160,
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
    fontSize: 26,
    fontWeight: '400',
    marginBottom: 20,
    letterSpacing: 1,
    color: '#000',
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: '#e8ecf8',
    width: '90%',
    paddingVertical: 35,
    paddingHorizontal: 25,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#2ACFB3',
    marginBottom: 40,
  },
  inputText: {
    backgroundColor: '#fff',
    height: 48,
    borderRadius: 25,
    paddingHorizontal: 20,
    marginBottom: 15,
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
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

export default Register;