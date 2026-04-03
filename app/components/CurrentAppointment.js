import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import useCurrentAppointment from '../hooks/useCurrentAppointment';

const CurrentAppointment = () => {
  const router = useRouter();
  const { filteredAppointments, isLoading, error, refresh, handleCancelacion } = useCurrentAppointment();
  
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    return status === 'confirmada' ? '#76A055' : '#E6B422';
  };

  const getStatusText = (status) => {
    return status === 'confirmada' ? 'CONFIRMADA' : 'PENDIENTE';
  };

  const handleCancelPress = (appointment) => {
    setSelectedAppointment(appointment);
    setModalVisible(true);
    setCancelReason('');
  };

  const handleConfirmCancel = async () => {
    if (!cancelReason.trim()) {
      Alert.alert('Error', 'Por favor ingrese un motivo para la cancelación');
      return;
    }

    setIsSubmitting(true);
    const success = await handleCancelacion(selectedAppointment._id || selectedAppointment.id, cancelReason);
    setIsSubmitting(false);

    if (success) {
      setModalVisible(false);
      setSelectedAppointment(null);
      setCancelReason('');
    }
  };

  const getPacienteDisplay = (appointment) => {
    // Si tienes los datos del paciente poblados desde el backend
    if (appointment.paciente_id && typeof appointment.paciente_id === 'object') {
      return appointment.paciente_id.nombre || appointment.paciente_id.username || 'Paciente';
    }
    // Si solo tienes el ID
    return appointment.paciente_id;
  };

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.headerText}>HEALTHTRACK</Text>

      <View style={styles.titleBanner}>
        <Text style={styles.titleBannerText}>CITAS ACTIVAS</Text>
        <Text style={styles.subtitleText}>Pendientes y Confirmadas</Text>
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
            <Text style={styles.emptyText}>No hay citas pendientes o confirmadas</Text>
          </View>
        ) : (
          filteredAppointments.map((item) => (
            <View key={item._id || item.id} style={styles.card}>
              <View style={styles.statusBadge}>
                <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                  {getStatusText(item.status)}
                </Text>
              </View>
              
              <View style={styles.infoContainer}>
                <Text style={styles.cardLabel}>
                  PACIENTE: <Text style={styles.cardValue}>{getPacienteDisplay(item)}</Text>
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

                {/* Botón de Cancelación */}
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={() => handleCancelPress(item)}
                >
                  <Text style={styles.cancelButtonText}>SOLICITAR CANCELACIÓN</Text>
                </TouchableOpacity>
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

      {/* Modal para solicitar motivo de cancelación */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => !isSubmitting && setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Solicitar Cancelación</Text>
            
            {selectedAppointment && (
              <View style={styles.modalInfo}>
                <Text style={styles.modalInfoText}>
                  Fecha: {formatDate(selectedAppointment.fecha_hora)} - {formatTime(selectedAppointment.fecha_hora)}
                </Text>
                <Text style={styles.modalInfoText}>
                  Motivo original: {selectedAppointment.motivo}
                </Text>
              </View>
            )}
            
            <Text style={styles.modalLabel}>Motivo de cancelación:</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Describa detalladamente el motivo de la cancelación..."
              multiline
              numberOfLines={4}
              value={cancelReason}
              onChangeText={setCancelReason}
              editable={!isSubmitting}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => setModalVisible(false)}
                disabled={isSubmitting}
              >
                <Text style={styles.modalButtonText}>CANCELAR</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalConfirmButton]}
                onPress={handleConfirmCancel}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.modalButtonText}>ENVIAR SOLICITUD</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  },
  statusText: {
    fontWeight: 'bold',
    fontSize: 12,
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
    marginBottom: 12,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: '400',
    color: '#000',
  },
  cardValue: {
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#E6B422',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 4,
    marginTop: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 12,
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
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalInfo: {
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 4,
    marginBottom: 15,
  },
  modalInfoText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
    fontSize: 14,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  modalCancelButton: {
    backgroundColor: '#ccc',
  },
  modalConfirmButton: {
    backgroundColor: '#E6B422',
  },
  modalButtonText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#000',
  },
});

export default CurrentAppointment;