import { Ionicons } from '@expo/vector-icons'; // Importamos los iconos
import React from "react";
import { ActivityIndicator, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import useLogin1 from "../hooks/useLogin1";

const Login1 = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    handleLogin,
    handleRegister,
    isLoading
  } = useLogin1();

  const handleSocialLogin = (platform) => {
    console.log(`Login with ${platform}`);
  };
  
  return (
    <View style={styles.container}>
      <Image
        style={styles.imagePrincipal}
        source={require('../assets/logo.png')}
        resizeMode="contain"
      />
      <Text style={styles.textcommon}>INICIAR SESION</Text>
      <View style={styles.containerlittle}>
        <View style={styles.inputWrapper}>
          <Ionicons name="person" size={20} color="#555" style={styles.inputIcon} />
          <TextInput
            style={styles.inputText}
            value={email}
            onChangeText={setEmail}
            placeholder="Usuario"
            placeholderTextColor="#666"
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!isLoading}
          />
        </View>
        <View style={styles.inputWrapper}>
          <Ionicons name="lock-closed" size={20} color="#555" style={styles.inputIcon} />
          <TextInput
            style={styles.inputText}
            value={password}
            onChangeText={setPassword}
            placeholder="Contraseña"
            placeholderTextColor="#666"
            secureTextEntry={true}
            editable={!isLoading}
          />
        </View>
        <View style={styles.divider} />
        <Text style={styles.textcommon2}>REDES SOCIALES</Text>
        <View style={styles.socialContainer}>
          <TouchableOpacity onPress={() => handleSocialLogin('X')}>
            <Image
              source={require('../assets/x.png')}
              style={styles.socialIcon}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleSocialLogin('Facebook')}>
            <Image
              source={require('../assets/facebook.png')}
              style={styles.socialIcon}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleSocialLogin('Instagram')}>
            <Image
              source={require('../assets/instagram.png')}
              style={styles.socialIcon}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleSocialLogin('TikTok')}>
            <Image
              source={require('../assets/tiktok.png')}
              style={styles.socialIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />
      ) : (
        <TouchableOpacity
          style={styles.buttonAction}
          onPress={handleLogin}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>INGRESAR</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        style={styles.buttonAction}
        onPress={handleRegister}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>REGISTRAR</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#f5f5f5', 
  },
  imagePrincipal: {
    width: 300, 
    height: 300,
    alignSelf: 'center',
    marginBottom: 10,
  },
  textcommon: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 30,
  },
  containerlittle: {
    borderColor: '#4DD0E1', 
    borderWidth: 2,
    alignItems: "center",
    paddingVertical: 25,
    paddingHorizontal: 20,
    width: '70%',
    borderRadius: 20,
    backgroundColor: '#cecece',
    marginBottom: 30, 
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5', 
    borderRadius: 25,
    width: '100%',
    height: 45,
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  inputText: {
    flex: 1,
    fontSize: 16,
    color: 'black',
    fontWeight: '500',
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: 'black',
    marginVertical: 10,
  },
  textcommon2: {
    fontSize: 12,
    color: 'black',
    marginBottom: 15,
    fontWeight: 'bold',
  },
  socialContainer: {
    width: '60%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  socialIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  buttonAction: {
    backgroundColor: '#cecece', 
    paddingVertical: 12,
    borderRadius: 25, 
    width: '60%',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Login1;