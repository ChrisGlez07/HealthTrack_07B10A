import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from "expo-router";
import { ActivityIndicator, Button, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import useCreateAppointment from "../hooks/useCreateAppointment";

const CreateAppointment = () => {
  const router = useRouter(); 
  
  const {
    fechaHora,
    status,
    setStatus,
    motivo,
    setMotivo,
    showPicker,
    mode,
    dateObject,
    onChangePicker,
    showMode,
    handleCreateAppointment,
    isLoading
  } = useCreateAppointment();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.TextInput}>Fecha y Hora de la Cita:</Text>
      
      <TouchableOpacity onPress={() => showMode('date')}>
        <View pointerEvents="none">
          <TextInput 
            style={styles.inputText}
            value={fechaHora}
            placeholder="Toca para seleccionar fecha y hora"
            editable={false}
          />
        </View>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={dateObject}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onChangePicker}
        />
      )}

      <Text style={styles.TextInput}>Estado:</Text>
      <TextInput 
        style={styles.inputText}
        value={status}
        onChangeText={setStatus}
        editable={!isLoading}
      />
      
      <Text style={styles.TextInput}>Motivo de la Cita:</Text>
      <TextInput 
        style={[styles.inputText, { height: 80 }]} 
        value={motivo}
        onChangeText={setMotivo}
        placeholder="Ej: Consulta general..."
        multiline={true}
        editable={!isLoading}
      />
      
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View style={styles.buttonContainer}>
          <Button 
            title="Agendar Cita" 
            onPress={handleCreateAppointment}
            color="#2196F3"
          />
          <Text 
            style={styles.linkText} 
            onPress={() => router.back()}
          >
            Cancelar y volver
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: '#f5f5f5', 
  },
  TextInput: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  inputText: {
    fontSize: 16,
    borderWidth: 1,
    padding: 8,
    borderColor: 'gray',
    color: 'black',
    backgroundColor: 'white',
    height: 40,
    marginBottom: 16,
    borderRadius: 5,
  },
  buttonContainer: {
    marginTop: 10,
  },
  linkText: {
    marginTop: 15,
    color: '#2196F3',
    textAlign: 'center',
    textDecorationLine: 'underline',
  }
});

export default CreateAppointment;