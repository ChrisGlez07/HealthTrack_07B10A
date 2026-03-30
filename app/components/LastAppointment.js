import { useRouter } from 'expo-router';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import useLastAppointment from '../hooks/useLastAppointment';

const LastAppointment = () => {
  const router = useRouter();
  const { filteredAppointments, isLoading, error, refresh } = useLastAppointment();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-MX', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status) => {
    return status === 'completada' ? '#76A055' : '#D9534F';
  };

  const getStatusText = (status) => {
    return status === 'completada' ? 'COMPLETADA' : 'CANCELADA';
  };

  const getStatusIcon = (status) => {
    return status === 'completada' ? '✓' : '✗';
  };

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.headerText}>HEALTHTRACK</Text>

      <View style={styles.titleBanner}>
        <Text style={styles.titleBannerText}>CITAS FINALIZADAS</Text>
        <Text style={styles.subtitleText}>Canceladas y Completadas</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#000" style={{ marginTop: 20 }} />
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={refresh}>
              <Text style={styles.retryButtonText}>REINTENTAR</Text>
            </TouchableOpacity>
          </View>
        ) : filteredAppointments.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay citas canceladas o completadas</Text>
          </View>
        ) : (
          filteredAppointments.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.statusBadge}>
                <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                  {getStatusIcon(item.status)} {getStatusText(item.status)}
                </Text>
              </View>
              
              <View style={styles.infoContainer}>
                <Text style={styles.cardLabel}>
                  PACIENTE: <Text style={styles.cardValue}>{item.paciente_id}</Text>
                </Text>
                
                <Text style={styles.cardLabel}>
                  MÉDICO: <Text style={styles.cardValue}>{item.medico_id}</Text>
                </Text>
                
                <View style={styles.row}>
                  <Text style={styles.cardLabel}>
                    MOTIVO: <Text style={styles.cardValue}>{item.motivo}</Text>
                  </Text>
                </View>
                
                <View style={styles.dateTimeContainer}>
                  <Text style={styles.cardLabel}>
                    FECHA: <Text style={styles.cardValue}>{formatDate(item.fecha_hora)}</Text>
                  </Text>
                  <Text style={styles.cardLabel}>
                    HORA: <Text style={styles.cardValue}>{formatTime(item.fecha_hora)}</Text>
                  </Text>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.refreshButton} onPress={refresh}>
          <Text style={styles.buttonText}>ACTUALIZAR</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.returnButton} onPress={() => router.back()}>
          <Text style={styles.buttonText}>REGRESAR</Text>
        </TouchableOpacity>
      </View>
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
  titleBanner: {
    backgroundColor: '#D9D9D9',
    padding: 8,
    borderBottomWidth: 1,
    borderColor: '#000',
    marginBottom: 20,
    alignItems: 'center',
  },
  titleBannerText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
  },
  subtitleText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#D9D9D9',
    padding: 15,
    marginBottom: 15,
    borderRadius: 4,
  },
  statusBadge: {
    marginBottom: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  statusText: {
    fontWeight: 'bold',
    fontSize: 13,
  },
  infoContainer: {
    flex: 1,
  },
  row: {
    marginTop: 8,
    marginBottom: 8,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: '400',
    color: '#000',
    marginBottom: 4,
  },
  cardValue: {
    fontWeight: 'bold',
  },
  errorContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#76A055',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 10,
    marginBottom: 20,
    gap: 10,
  },
  refreshButton: {
    backgroundColor: '#76A055',
    width: '100%',
    padding: 15,
    alignItems: 'center',
  },
  returnButton: {
    backgroundColor: '#D9D9D9',
    width: '100%',
    padding: 15,
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 14,
  }
});

export default LastAppointment;