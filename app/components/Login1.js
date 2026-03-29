import { ActivityIndicator, Button, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
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
      <Text style={styles.textcommon}>Email:</Text>
      <TextInput
        style={styles.inputText}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!isLoading}
      />

      <Text style={styles.textcommon}>Password:</Text>
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
            title="Login"
            onPress={handleLogin}
          />
        </View>
      )}
      <View style={styles.buttonContainer}>
        <Button
          title="Register"
          onPress={handleRegister}
        />
      </View>
      <View style={styles.socialContainer}>
        <TouchableOpacity
          style={styles.socialButton}
          onPress={() => handleSocialLogin('X')}
        >
          <Image
            source={require('../assets/x.png')}
            style={styles.socialIcon}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.socialButton}
          onPress={() => handleSocialLogin('Facebook')}
        >
          <Image
            source={require('../assets/facebook.png')}
            style={styles.socialIcon}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.socialButton}
          onPress={() => handleSocialLogin('Instagram')}
        >
          <Image
            source={require('../assets/instagram.png')}
            style={styles.socialIcon}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.socialButton}
          onPress={() => handleSocialLogin('TikTok')}
        >
          <Image
            source={require('../assets/tiktok.png')}
            style={styles.socialIcon}
          />
        </TouchableOpacity>
      </View>
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
  buttonContainer: {
    marginTop: 10,
    marginBottom: 10,
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
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  socialButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginHorizontal: 5,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
  },
  socialIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  imagePrincipal: {
    width: 250,
    height: 250,
    alignSelf: 'center',
    marginBottom: 30,
  }
});

export default Login1;