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
      <View style={styles.header}>
        <Image
          style={styles.userAvatar}
          source={require('../assets/logo.png')}
          resizeMode="contain"
        />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{userData?.name || "Usuario"}</Text>
          <Text style={styles.userEmail}>{userData?.email || "email@ejemplo.com"}</Text>
          <Text style={styles.userRole}>{getUserRoleName()}</Text>
        </View>
        <TouchableOpacity style={styles.logoutButtonHeader} onPress={handleLogout}>
          <Text style={styles.logoutTextHeader}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.menuContainer}>
        <Text style={styles.menuTitle}>Menu Options</Text>
        <View style={styles.optionsGrid}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  userRole: {
    fontSize: 12,
    color: '#007BFF',
    fontWeight: '500',
  },
  logoutButtonHeader: {
    backgroundColor: '#dc3545',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutTextHeader: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  menuContainer: {
    flexGrow: 1,
    padding: 20,
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  optionCard: {
    width: '31%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  optionIcon: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  optionText: {
    fontSize: 12,
    textAlign: 'center',
    color: '#333',
    fontWeight: '500',
  },
});