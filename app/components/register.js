import { useRouter } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";

export default function Register() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register Screen</Text>
      <Text style={styles.message}>
        This is a placeholder for the registration component.
        {'\n\n'}
        Your teammate will add the actual registration functionality here.
      </Text>
      <Button 
        title="Back to Login" 
        onPress={() => router.back()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  }
});