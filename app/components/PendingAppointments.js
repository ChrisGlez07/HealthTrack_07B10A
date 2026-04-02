import { useRouter } from 'expo-router';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import usePendingAppointments from '../hooks/usePendingAppointments';

const PendingAppointments = () => {
  const router = useRouter();
  const { appointments, isLoading, handleConfirmAppointment } = usePendingAppointments();

  return (
    <View style={styles.mainContainer}>
      <View style={styles.headerContainer}>
        <Image 
          source={require('../assets/HealthTrack.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.titleText}>CITAS PENDIENTES A CONFIRMAR</Text>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#34b7f1" style={{ marginTop: 20 }} />
        ) : appointments.length === 0 ? (
          <Text style={styles.emptyText}>No hay citas pendientes.</Text>
        ) : (
          appointments.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.infoContainer}>
                <Text style={styles.cardLabel}>PACIENTE: <Text style={styles.cardValue}>{item.paciente_id}</Text></Text>
                
                <View style={styles.row}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardLabel}>MOTIVO:</Text>
                    <Text style={styles.cardValue}>{item.motivo}</Text>
                  </View>
                  <View style={{ flex: 1, alignItems: 'flex-end' }}>
                    <Text style={styles.cardLabel}>FECHA:</Text>
                    <Text style={styles.cardValue}>{item.fecha_hora.split(' ')[0]}</Text>
                  </View>
                </View>
              </View>
              
              <TouchableOpacity 
                style={styles.confirmButton} 
                onPress={() => handleConfirmAppointment(item.id)}
              >
                <Text style={styles.confirmButtonText}>CONFIRMAR</Text>
              </TouchableOpacity>
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
    marginBottom: 20,
    padding: 10,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  titleText: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '400',
    marginBottom: 20,
    color: '#000',
    letterSpacing: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#e8ecf8', 
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 20, 
    borderWidth: 2,
    borderColor: '#82e0d8', 
  },
  infoContainer: {
    flex: 1,
    marginRight: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  cardLabel: {
    fontSize: 10,
    fontWeight: '400',
    color: '#666',
    textTransform: 'uppercase',
  },
  cardValue: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#000',
  },
  confirmButton: {
    backgroundColor: '#fff', 
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: '#82e0d8',
    minWidth: 85,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#444',
    fontWeight: 'bold',
    fontSize: 10,
  },
  returnButton: {
    backgroundColor: '#e1e8f9', 
    width: '100%',
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 25, 
    borderWidth: 2,
    borderColor: '#82e0d8',
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 13,
    color: '#444',
    letterSpacing: 1,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#999',
    fontSize: 16,
  }
});

export default PendingAppointments;