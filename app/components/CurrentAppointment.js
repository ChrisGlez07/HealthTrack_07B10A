import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Image, Modal, RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import useCurrentAppointment from '../hooks/useCurrentAppointment';

const CurrentAppointment = () => {
  const router = useRouter();
  const { appointments, isLoading, error, refresh, handleCancelacion } = useCurrentAppointment();
  
  const [activeFilter, setActiveFilter] = useState('todas'); 
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const displayedAppointments = appointments.filter(item => {
    if (activeFilter === 'todas') return true;
    if (activeFilter === 'pendientes') return item.status === 'pendiente' || item.status === 'pendiente_aprobacion';
    if (activeFilter === 'confirmadas') return item.status === 'confirmada';
    if (activeFilter === 'canceladas') return item.status === 'cancelada';
    return true;
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'Fecha no disponible';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Fecha inválida';
    return date.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'Hora no disponible';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Hora inválida';
    return date.toLocaleTimeString('es-MX', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const canCancel = (status) => {
    return status === 'pendiente' || status === 'confirmada';
  };

  const getMedicoDisplay = (appointment) => {
    try {
      if (appointment?.medico_id && typeof appointment.medico_id === 'object') {
        const medico = appointment.medico_id;
        return medico?.nombre || medico?.username || 'Médico';
      }
      if (typeof appointment?.medico_id === 'string') {
        return appointment.medico_id;
      }
      return 'Médico';
    } catch (error) {
      return 'Médico';
    }
  };

  const getPacienteDisplay = (appointment) => {
    try {
      if (appointment?.paciente_id && typeof appointment.paciente_id === 'object') {
        const paciente = appointment.paciente_id;
        return paciente?.nombre || paciente?.username || 'Paciente';
      }
      if (typeof appointment?.paciente_id === 'string') {
        return appointment.paciente_id;
      }
      return 'Paciente';
    } catch (error) {
      return 'Paciente';
    }
  };

  const getStatusText = (status) => {
    if (!status) return 'DESCONOCIDO';
    switch(status) {
      case 'pendiente': return 'PENDIENTE';
      case 'pendiente_aprobacion': return 'PENDIENTE APROBACIÓN';
      case 'confirmada': return 'CONFIRMADA';
      case 'cancelada': return 'CANCELADA';
      case 'completada': return 'COMPLETADA';
      default: return status.toUpperCase();
    }
  };

  const getStatusColor = (status) => {
    if (!status) return '#999';
    switch(status) {
      case 'pendiente': return '#FFB74D';
      case 'pendiente_aprobacion': return '#FF9800';
      case 'confirmada': return '#82E076';
      case 'cancelada': return '#FF6B6B';
      case 'completada': return '#2196F3';
      default: return '#999';
    }
  };

  const handleCancelPress = (appointment) => {
    if (!canCancel(appointment?.status)) {
      Alert.alert('Error', `No se puede cancelar esta cita.`);
      return;
    }
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
    const success = await handleCancelacion(selectedAppointment?._id || selectedAppointment?.id, cancelReason);
    setIsSubmitting(false);

    if (success) {
      setModalVisible(false);
      setSelectedAppointment(null);
      setCancelReason('');
    }
  };

  return (
    <View style={styles.mainContainer}>
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.menuIcon}>
          <Feather name="menu" size={28} color="#000" />
        </TouchableOpacity>
        <View style={styles.logoContainer}>
          <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />
          <Text style={styles.brandText}>Health<Text style={{fontWeight: '400'}}>Track</Text></Text>
        </View>
        <View style={{ width: 28 }} />
      </View>

      <Text style={styles.pageTitle}>HISTORIAL DE CITAS</Text>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refresh} />}
      >
        {isLoading ? (
          <ActivityIndicator size="large" color="#000" style={{ marginTop: 20 }} />
        ) : error ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={refresh}>
              <Text style={styles.retryButtonText}>REINTENTAR</Text>
            </TouchableOpacity>
          </View>
        ) : displayedAppointments.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay citas para mostrar en este filtro.</Text>
          </View>
        ) : (
          displayedAppointments.map((item) => (
            <View key={item?._id || item?.id || Math.random().toString()} style={styles.card}>
              
             
              <View style={styles.cardTopRow}>
                <View style={styles.contextColumn}>
                  <Text style={styles.contextText}>{item?.motivo || 'Sin motivo'}</Text>
                  <Text style={styles.subContextText}>Dr. {getMedicoDisplay(item)}</Text>
                  <Text style={styles.patientText}>Paciente: {getPacienteDisplay(item)}</Text>
                </View>
                
                <View style={styles.dateColumn}>
                  <Text style={styles.dateText}>{formatDate(item?.fecha_hora)}</Text>
                  <Text style={styles.timeText}>{formatTime(item?.fecha_hora)}</Text>
                  <View style={styles.clockCircle}>
                    <Feather name="clock" size={16} color="#4DB6AC" />
                  </View>
                </View>
              </View>

              <View style={styles.statusContainer}>
                <Text style={[styles.statusText, { color: getStatusColor(item?.status) }]}>
                  {getStatusText(item?.status)}
                </Text>
              </View>

             
              {canCancel(item?.status) && (
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={() => handleCancelPress(item)}
                >
                  <Text style={styles.cancelButtonText}>SOLICITAR CANCELACIÓN</Text>
                </TouchableOpacity>
              )}

              {item?.status === 'pendiente_aprobacion' && (
                <View style={styles.pendingApprovalContainer}>
                  <Text style={styles.pendingApprovalText}>⏳ Cancelación solicitada - Esperando aprobación</Text>
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>

    
      <View style={styles.filtersContainer}>
        {activeFilter !== 'confirmadas' && (
          <TouchableOpacity 
            style={[styles.filterBtn, { backgroundColor: '#82E076' }]} 
            onPress={() => setActiveFilter('confirmadas')}
          >
            <Text style={styles.filterBtnText}>CONFIRMADAS</Text>
          </TouchableOpacity>
        )}

        {activeFilter !== 'canceladas' && (
          <TouchableOpacity 
            style={[styles.filterBtn, { backgroundColor: '#FF6B6B' }]} 
            onPress={() => setActiveFilter('canceladas')}
          >
            <Text style={styles.filterBtnText}>CANCELADAS</Text>
          </TouchableOpacity>
        )}

        {activeFilter !== 'pendientes' && (
          <TouchableOpacity 
            style={[styles.filterBtn, { backgroundColor: '#FFB74D' }]} 
            onPress={() => setActiveFilter('pendientes')}
          >
            <Text style={styles.filterBtnText}>PENDIENTES</Text>
          </TouchableOpacity>
        )}
      </View>

     
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
                   Fecha: {formatDate(selectedAppointment?.fecha_hora)} - {formatTime(selectedAppointment?.fecha_hora)}
                </Text>
                <Text style={styles.modalInfoText}>
                   Médico: {getMedicoDisplay(selectedAppointment)}
                </Text>
                <Text style={styles.modalInfoText}>
                   Motivo original: {selectedAppointment?.motivo || 'No especificado'}
                </Text>
              </View>
            )}
            
            <Text style={styles.modalLabel}>Motivo de cancelación:</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Describa el motivo"
              placeholderTextColor="#999"
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
                  <Text style={styles.modalButtonText}>ENVIAR</Text>
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  menuIcon: {
    padding: 5,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    marginBottom: 5,
  },
  brandText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  pageTitle: {
    fontSize: 22,
    textAlign: 'center',
    fontWeight: '400',
    letterSpacing: 1,
    marginBottom: 20,
    textTransform: 'uppercase'
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#D9D9D9',
    borderRadius: 6,
    padding: 15,
    marginBottom: 15,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  contextColumn: {
    flex: 1,
    marginRight: 10,
  },
  contextText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#000',
    marginBottom: 4,
  },
  subContextText: {
    fontSize: 12,
    color: '#555',
    marginTop: 2,
  },
  patientText: {
    fontSize: 11,
    color: '#777',
    marginTop: 2,
  },
  dateColumn: {
    alignItems: 'flex-end',
  },
  dateText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  timeText: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
  },
  clockCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#4DB6AC',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  statusContainer: {
    marginTop: 12,
    marginBottom: 8,
  },
  statusText: {
    fontWeight: 'bold',
    fontSize: 11,
  },
  cancelButton: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    borderRadius: 4,
    marginTop: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  cancelButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 11,
  },
  pendingApprovalContainer: {
    marginTop: 10,
    alignItems: 'flex-start',
  },
  pendingApprovalText: {
    fontSize: 11,
    color: '#E65100',
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
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
  filtersContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 20,
    paddingBottom: 80,
    paddingTop: 10,
    backgroundColor: '#fff',
  },
  filterBtn: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBtnText: {
    color: '#000',
    fontWeight: '500',
    fontSize: 11,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
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
    backgroundColor: 'rgb(94, 96, 221)',
  },
  modalButtonText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#000',
  },
});

export default CurrentAppointment;