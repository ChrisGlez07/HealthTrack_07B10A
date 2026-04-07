//Final App
import { useRouter } from 'expo-router';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import useCancelRequest from '../hooks/useCancelRequest';

const CancelRequest = () => {
  const router = useRouter();
  const { appointments, isLoading, handleConfirmAppointment } = useCancelRequest();

  const formatDate = (dateString) => {
    if (!dateString) return "Sin fecha";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Fecha Inválida";
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    } catch (e) { return "Error fecha"; }
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.headerContainer}>
        <Image 
          source={require('../assets/HealthTrack.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.titleText}>CITAS PENDIENTES DE CANCELAR</Text>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#34b7f1" style={{ marginTop: 20 }} />
        ) : appointments.length === 0 ? (
          <Text style={styles.emptyText}>No hay citas pendientes.</Text>
        ) : (
          appointments.map((item) => (
            <View key={item._id || item.id} style={styles.card}>
              
              <View style={styles.infoContainer}>
                <Text style={styles.cardLabel}>
                  PACIENTE: <Text style={styles.cardValue}>
                    {item.paciente_id?.username || "Usuario Desconocido"}
                  </Text>
                </Text>
                
                <View style={styles.reasonSection}>
                  <Text style={styles.cardLabel}>MOTIVO:</Text>
                  <Text style={styles.cardValueReason}>{item.motivo || "No especificado"}</Text>
                </View>
              </View>
              
              <View style={styles.rightActionsContainer}>
                <View style={styles.dateBadge}>
                  <Text style={styles.dateLabel}>FECHA:</Text>
                  <Text style={styles.dateText}>{formatDate(item.fecha_hora)}</Text>
                </View>

                <TouchableOpacity 
                  style={styles.confirmButton} 
                  onPress={() => handleConfirmAppointment(item._id || item.id)}
                >
                  <Text style={styles.confirmButtonText}>CONFIRMAR</Text>
                </TouchableOpacity>
              </View>

            </View>
          ))
        )}
      </ScrollView>

      <TouchableOpacity style={styles.returnButton} onPress={() => router.back()}>
        <Text style={styles.buttonText}>REGRESAR</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  headerContainer: {
    width: '100%',
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    padding: 10,
  },
   logo: {
    width: 300,
    height: 300,
    alignSelf: 'center',
    marginBottom: 10,
  },
  titleText: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '500',
    marginBottom: 20,
    color: '#333',
    letterSpacing: 1,
  },
  scrollContent: { paddingBottom: 20 },
  card: {
    backgroundColor: '#e8ecf8', 
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row', 
    alignItems: 'flex-start',
    borderRadius: 20, 
    borderWidth: 2,
    borderColor: '#82e0d8', 
    elevation: 2, 
  },
  infoContainer: {
    flex: 1, 
    marginRight: 10,
  },
  rightActionsContainer: {
    alignItems: 'flex-end', 
    justifyContent: 'center',
    gap: 10, 
  },
  dateBadge: {
    backgroundColor: '#82e0d8',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignItems: 'center',
    minWidth: 85, 
  },
  dateLabel: { fontSize: 7, color: '#fff', fontWeight: '400' },
  dateText: { color: '#fff', fontWeight: 'bold', fontSize: 10 },
  reasonSection: { marginTop: 15 },
  cardLabel: { fontSize: 10, fontWeight: '400', color: '#666', textTransform: 'uppercase' },
  cardValue: { fontWeight: 'bold', fontSize: 13, color: '#000' },
  cardValueReason: { fontWeight: 'bold', fontSize: 12, color: '#333', marginTop: 2 },
  confirmButton: {
    backgroundColor: '#fff', 
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#82e0d8',
    minWidth: 85,
    alignItems: 'center',
  },
  confirmButtonText: { color: '#444', fontWeight: 'bold', fontSize: 10 },
   returnButton: {
    borderColor: '#82e0d8',
    borderWidth: 1.5,
    marginBottom: 90,
    backgroundColor: '#e8ecf8',
    paddingVertical: 8,
    borderRadius: 12,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: { fontWeight: 'bold', fontSize: 14, color: '#444' },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#999', fontSize: 16 }
});

export default CancelRequest;