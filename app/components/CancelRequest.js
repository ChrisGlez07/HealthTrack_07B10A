import { useRouter } from 'expo-router';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import useCancelRequest from '../hooks/useCancelRequest';

const CancelRequest = () => {
  const router = useRouter();
  const { appointments, isLoading, handleAcceptCancel } = useCancelRequest();

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.headerText}>HEALTHTRACK</Text>

      <View style={styles.titleBanner}>
        <Text style={styles.titleBannerText}>PETICIÓN DE CANCELACIÓN</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#000" style={{ marginTop: 20 }} />
        ) : (
          appointments.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.infoContainer}>
                <Text style={styles.cardLabel}>PACIENTE: <Text style={styles.cardValue}>{item.paciente_id}</Text></Text>
                <View style={styles.row}>
                    <Text style={styles.cardLabel}>CONTEXT: <Text style={styles.cardValue}>{item.motivo}</Text></Text>
                    <Text style={styles.cardLabel}>DATE: <Text style={styles.cardValue}>{item.fecha_hora.split(' ')[0]}</Text></Text>
                </View>
              </View>
              
              <TouchableOpacity 
                style={styles.acceptButton} 
                onPress={() => handleAcceptCancel(item.id)}
              >
                <Text style={styles.acceptButtonText}>ACEPTAR</Text>
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
  headerText: {
    fontSize: 28,
    textAlign: 'center',
    fontWeight: '300',
    letterSpacing: 2,
    marginBottom: 30,
  },
  addButton: {
    backgroundColor: '#D9D9D9',
    width: 120,
    padding: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  titleBanner: {
    backgroundColor: '#D9D9D9',
    padding: 8,
    borderBottomWidth: 1,
    borderColor: '#000',
    marginBottom: 20,
  },
  titleBannerText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#D9D9D9',
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoContainer: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    marginRight: 10,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: '400',
    color: '#000',
  },
  cardValue: {
    fontWeight: 'bold',
  },
  acceptButton: {
    backgroundColor: '#76A055',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 2,
  },
  acceptButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  returnButton: {
    backgroundColor: '#D9D9D9',
    width: '100%',
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 14,
  }
});

export default CancelRequest;