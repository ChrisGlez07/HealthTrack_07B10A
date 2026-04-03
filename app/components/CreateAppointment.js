import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from "expo-router";
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import useCreateAppointment from "../hooks/useCreateAppointment";

const CreateAppointment = () => {
  const router = useRouter();
  const {
    fecha, hora, setHora, horasDisponibles,
    medicos, medicoSeleccionado, setMedicoSeleccionado,
    motivo, setMotivo,
    showPicker, setShowPicker, dateObject, onChangePicker,
    handleCreateAppointment, isLoading
  } = useCreateAppointment();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <Image 
          source={require('../assets/HealthTrack.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.headerTitle}>Agregar Cita</Text>
      </View>

      {/* Selector de Médico */}
      <View style={styles.blueBox}>
        <Text style={styles.label}>DOCTOR</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={medicoSeleccionado}
            onValueChange={(itemValue) => setMedicoSeleccionado(itemValue)}
            style={styles.picker}
            dropdownIconColor="#333"
          >
            <Picker.Item label="Seleccione un profesional..." value="" />
            {medicos.map((medico) => (
              <Picker.Item 
                key={medico._id} 
                label={`${medico.username} - ${medico.especialidad}`} 
                value={medico._id} 
              />
            ))}
          </Picker>
        </View>
      </View>

      {/* Selector de Fecha */}
      <TouchableOpacity 
        style={styles.blueBox} 
        onPress={() => setShowPicker(true)} 
        activeOpacity={0.8}
      >
        <Text style={styles.label}>DATE</Text>
        <View style={styles.row}>
          <TextInput 
            style={styles.dateInput}
            value={fecha}
            placeholder="DD-MM-YYYY"
            placeholderTextColor="#555"
            editable={false}
          />
          <Image 
            source={require('../assets/calendario.png')} 
            style={styles.smallIcon}
          />
        </View>
      </TouchableOpacity>

      {/* DateTimePicker */}
      {showPicker && (
        <DateTimePicker
          value={dateObject}
          mode="date"
          display="default"
          minimumDate={new Date(Date.now() + 86400000)}
          onChange={onChangePicker}
        />
      )}

      {/* Selector de Hora */}
      <View style={styles.blueBox}>
        <Text style={styles.label}>TIME</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={hora}
            onValueChange={(itemValue) => setHora(itemValue)}
            style={styles.picker}
            dropdownIconColor="#333"
          >
            <Picker.Item label="Seleccione una hora..." value="" />
            {horasDisponibles.map((horaItem) => (
              <Picker.Item 
                key={horaItem} 
                label={horaItem} 
                value={horaItem} 
              />
            ))}
          </Picker>
        </View>
      </View>

      {/* Motivo/Contexto */}
      <View style={[styles.blueBox, { height: 140 }]}>
        <Text style={styles.label}>CONTEXT / MOTIVO</Text>
        <TextInput 
          style={styles.textArea} 
          value={motivo}
          onChangeText={setMotivo}
          placeholder="Describa el motivo de la consulta..."
          placeholderTextColor="#555"
          multiline={true}
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      {/* Botones */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.menuButton} 
          onPress={() => router.replace("/components/Menu")}
        >
          <Text style={styles.buttonText}>MENU</Text>
        </TouchableOpacity>

        {isLoading ? (
          <ActivityIndicator size="large" color="#4CAF50" />
        ) : (
          <TouchableOpacity 
            style={[
              styles.addButton, 
              (!fecha || !hora || !medicoSeleccionado || !motivo) && styles.buttonDisabled
            ]} 
            onPress={handleCreateAppointment}
            disabled={!fecha || !hora || !medicoSeleccionado || !motivo}
          >
            <Text style={styles.buttonText}>AÑADIR CITA</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Mostrar mensaje si no hay médicos */}
      {medicos.length === 0 && !isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#80C0E0" />
          <Text style={styles.loadingText}>Cargando médicos...</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { 
    paddingHorizontal: 30, 
    paddingVertical: 40, 
    backgroundColor: '#FFFFFF', 
    flexGrow: 1 
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 300,
    height: 150,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    color: '#333',
    fontWeight: '400',
  },
  blueBox: {
    backgroundColor: '#80C0E0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    justifyContent: 'center',
  },
  label: {
    fontSize: 12,
    color: '#333',
    fontWeight: '600',
    marginBottom: 2,
  },
  pickerWrapper: {
    height: 40,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    paddingHorizontal: 5,
  },
  picker: {
    width: '100%',
    color: '#333',
    backgroundColor: 'transparent',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateInput: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    padding: 8,
  },
  textArea: {
    backgroundColor: '#FFF',
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
    height: 80,
    textAlignVertical: 'top',
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    paddingBottom: 20,
    gap: 20,
  },
  menuButton: {
    backgroundColor: '#4DB6C1', 
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#4CAF50', 
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#A5D6A5',
    opacity: 0.7,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase'
  },
  smallIcon: {
    width: 40,  
    height: 40,
    marginLeft: 10,
  },
  loadingContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#80C0E0',
    fontSize: 14,
  }
});

export default CreateAppointment;