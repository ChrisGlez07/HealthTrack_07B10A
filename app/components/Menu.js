//Final App
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import useMenu from "../hooks/useMenu";

export default function Menu() {
  const {
    userData,
    userRole,
    isLoading,
    filteredOptions,
    handleLogout,
    navigateTo,
    getUserRoleName
  } = useMenu();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>

        <Image
          style={styles.imagePrincipal}
          source={require('../assets/logo.png')}
          resizeMode="contain"
        />

        <View style={styles.optionsList}>
          {filteredOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={styles.optionCard}
              onPress={() => navigateTo(option.route)}
            >
              <Image
                source={option.icon}
                style={styles.optionIcon}
                resizeMode="contain"
              />
              <Text style={styles.optionText}>{option.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  imagePrincipal: {
    width: 300,
    height: 300,
    alignSelf: 'center',
    marginBottom: 10,
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5', 
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 30,
    paddingTop: 50,
    paddingBottom: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoIcon: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  logoText: {
    fontSize: 22,
    color: '#1a2b3c',
  },
  optionsList: {
    flexDirection: 'column', 
    width: '100%',
  },
  optionCard: {
    flexDirection: 'row', 
    backgroundColor: '#dcdcdc', 
    borderRadius: 25, 
    paddingVertical: 15,
    paddingHorizontal: 25,
    marginBottom: 15,
    alignItems: 'center',
  },
  optionIcon: {
    width: 45,
    height: 45,
    marginRight: 20, 
  },
  optionText: {
    fontSize: 18,
    color: '#000000',
    fontWeight: '400',
  },
  logoutButton: {
    backgroundColor: '#959ce3',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    alignSelf: 'center', 
    marginBottom: 80,
  },
  logoutText: {
    color: '#3b436e', 
    fontSize: 18,
    fontWeight: '400',
  },
});