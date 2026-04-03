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

        {/* Sección del Logo (Puedes reemplazar la imagen con tu logo real de HealthTrack) */}
        <Image
          style={styles.imagePrincipal}
          source={require('../assets/logo.png')}
          resizeMode="contain"
        />

        {/* Lista de Opciones */}
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

      {/* Botón de Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Long out</Text>
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
    backgroundColor: '#f5f5f5', // Fondo blanco como en la imagen
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
    flexDirection: 'column', // Cambiado de row a column
    width: '100%',
  },
  optionCard: {
    flexDirection: 'row', // Ícono a la izquierda, texto a la derecha
    backgroundColor: '#dcdcdc', // Gris claro de la imagen
    borderRadius: 25, // Bordes muy redondeados (forma de píldora)
    paddingVertical: 15,
    paddingHorizontal: 25,
    marginBottom: 15,
    alignItems: 'center',
    // Sombras eliminadas para dar el aspecto plano del diseño original
  },
  optionIcon: {
    width: 45,
    height: 45,
    marginRight: 20, // Espacio entre el ícono y el texto
  },
  optionText: {
    fontSize: 18,
    color: '#000000',
    fontWeight: '400',
  },
  logoutButton: {
    backgroundColor: '#959ce3', // Color morado claro
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    alignSelf: 'center', // Centrado en la parte inferior
    marginBottom: 80,
  },
  logoutText: {
    color: '#3b436e', // Texto oscuro acorde al fondo morado
    fontSize: 18,
    fontWeight: '400',
  },
});