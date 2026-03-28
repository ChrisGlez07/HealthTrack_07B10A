import { ActivityIndicator, Button, StyleSheet, Text, TextInput, View } from "react-native";
import useLogin1 from "../hooks/useLogin1";

const Login1 = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    handleLogin,
    isLoading
  } = useLogin1();

  return (
    <View style={styles.container}>
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
        <Button 
          title="Login" 
          onPress={handleLogin}
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

export default Login1;