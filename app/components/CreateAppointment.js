//Final App
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from "expo-router";
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import useCreateAppointment from "../hooks/useCreateAppointment";

const CreateAppointment = () => {
  const router = useRouter();
  const {
    fecha,
    hora,
    setHora,
    horasDisponibles,
    medicos,
    medicoSeleccionado,
    setMedicoSeleccionado,
    pacientes,
    pacienteSeleccionado,
    setPacienteSeleccionado,
    motivo,
    setMotivo,
    showPicker,
    setShowPicker,
    dateObject,
    onChangePicker,
    handleCreateAppointment,
    isLoading,
    currentUser
  } = useCreateAppointment();

  const isPaciente = currentUser?.role === "3";
  const isMedico = currentUser?.role === "1";

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

      {!isPaciente && (
        <View style={styles.blueBox}>
          <Text style={styles.label}>PACIENTE</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={pacienteSeleccionado}
              onValueChange={(itemValue) => setPacienteSeleccionado(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Seleccione un paciente..." value="" />
              {pacientes.map((p) => (
                <Picker.Item key={p._id} label={p.username} value={p._id} />
              ))}
            </Picker>
          </View>
        </View>
      )}

      {!isMedico && (
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
              {medicos.map((m) => (
                <Picker.Item key={m._id} label={`${m.username} - ${m.especialidad}`} value={m._id} />
              ))}
            </Picker>
          </View>
        </View>
      )}

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

      {showPicker && (
        <DateTimePicker
          value={dateObject}
          mode="date"
          display="default"
          minimumDate={new Date(Date.now() + 86400000)}
          onChange={onChangePicker}
        />
      )}

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
            {horasDisponibles.map((h) => (
              <Picker.Item key={h} label={h} value={h} />
            ))}
          </Picker>
        </View>
      </View>

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
              (!fecha || !hora || !motivo) && styles.buttonDisabled
            ]}
            onPress={handleCreateAppointment}
            disabled={!fecha || !hora || !motivo}
          >
            <Text style={styles.buttonText}>AÑADIR CITA</Text>
          </TouchableOpacity>
        )}
      </View>
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
    height: 300,
    alignSelf: 'center',
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    color: '#333',
    fontWeight: '400',
  },
  blueBox: {
    backgroundColor: '#82e0d8',
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
    backgroundColor: '#69b9c7',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: 'rgb(35, 176, 134)',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: 'rgb(129, 215, 189)',
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