import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from "expo-router";
import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
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
      <Text style={styles.header}>Nueva Cita Médica</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Médico Especialista</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={medicoSeleccionado}
            onValueChange={(val) => setMedicoSeleccionado(val)}
            style={styles.picker}
          >
            <Picker.Item label="Seleccione un profesional..." value="" color="#999" />
            {medicos.map(m => (
              <Picker.Item key={m._id} label={`${m.username} (${m.especialidad})`} value={m._id} />
            ))}
          </Picker>
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Fecha de Consulta</Text>
        <TouchableOpacity onPress={() => setShowPicker(true)} activeOpacity={0.7}>
          <TextInput 
            style={styles.inputText}
            value={fecha}
            placeholder="DD-MM-YYYY"
            editable={false}
          />
        </TouchableOpacity>
      </View>

      {showPicker && (
        <DateTimePicker
          value={dateObject}
          mode="date"
          display="default"
          minimumDate={new Date(Date.now() + 86400000)}
          onChange={onChangePicker}
        />
      )}

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Horario Disponible</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={hora}
            onValueChange={(val) => setHora(val)}
            style={styles.picker}
          >
            <Picker.Item label="Seleccione una hora..." value="" color="#999" />
            {horasDisponibles.map(h => (
              <Picker.Item key={h} label={h} value={h} />
            ))}
          </Picker>
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Motivo de la Cita</Text>
        <TextInput 
          style={styles.textArea} 
          value={motivo}
          onChangeText={setMotivo}
          placeholder="Describa brevemente su malestar o motivo de consulta..."
          multiline={true}
          numberOfLines={4}
        />
      </View>

      <View style={styles.footer}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#2196F3" />
        ) : (
          <>
            <TouchableOpacity style={styles.mainButton} onPress={handleCreateAppointment}>
              <Text style={styles.buttonText}>Confirmar Cita</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => router.back()} style={styles.cancelButton}>
              <Text style={styles.cancelText}>Cancelar y regresar</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { 
    paddingHorizontal: 25, 
    paddingVertical: 30, 
    backgroundColor: '#FFFFFF', 
    flexGrow: 1 
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 25,
    textAlign: 'center'
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: { 
    fontSize: 14, 
    fontWeight: '600', 
    marginBottom: 8, 
    color: '#555',
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  inputText: { 
    fontSize: 16, 
    backgroundColor: '#F5F7FA', 
    borderWidth: 1, 
    borderColor: '#E1E8ED', 
    paddingHorizontal: 15,
    paddingVertical: 12, 
    borderRadius: 10,
    color: '#333'
  },
  pickerWrapper: { 
    backgroundColor: '#F5F7FA', 
    borderWidth: 1, 
    borderColor: '#E1E8ED', 
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'center'
  },
  picker: {
    height: 55, // Altura vertical consistente
    width: '100%',
  },
  textArea: { 
    fontSize: 16, 
    backgroundColor: '#F5F7FA', 
    borderWidth: 1, 
    borderColor: '#E1E8ED', 
    paddingHorizontal: 15,
    paddingTop: 15, 
    paddingBottom: 15,
    borderRadius: 10,
    height: 120,
    textAlignVertical: 'top', 
    color: '#333'
  },
  footer: {
    marginTop: 20,
    paddingBottom: 40
  },
  mainButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold'
  },
  cancelButton: {
    marginTop: 15,
    alignItems: 'center'
  },
  cancelText: {
    color: '#7F8C8D',
    fontSize: 14,
    textDecorationLine: 'underline'
  }
});

export default CreateAppointment;