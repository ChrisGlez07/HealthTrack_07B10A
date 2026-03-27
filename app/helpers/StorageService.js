import AsyncStorage from '@react-native-async-storage/async-storage';
import SecureStore from 'expo-secure-store';

class StorageService {
    //REGEX
    //Common patterns
    static patterns = {
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
    };

    static validate(type, value) {
        return this.patterns[type] ? this.patterns[type].test(value) : false;
    }

    //ASYNC STORAGE
    static async setItem(key, value) {
        try {
            const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
            await AsyncStorage.setItem(key, stringValue);
        } catch (error) {
            console.error("Error guardando en AsyncStorage:", error);
        }
    }

    static async getItem(key){
        try {
            const value = await AsyncStorage.getItem(key);
            try {
                return JSON.parse(value);
            }catch {
                return value;
            }

        } catch (error) {
            console.error("Error al obtener datos en AsyncStorage:", error);
            return null;
        }
    }

    //SecureStore Sensititve data storage

    static async saveToken(key,token){
        try {
            // SecureStore solo acepta String
            await SecureStore.setItemAsync(key, token);
        }catch (error) {
            console.error("Error en SecureStore:", error);
        }
    }

    //SecureStore Sensititve data get

    static async getToken(key){
        try {
            return await SecureStore.getItemAsync(key);
        } catch (error) {
            console.error("No se pudieron recuperar las credenciales", error);
            return null;
        }
    }

    static async resetToken(key){
        await SecureStore.deleteItemAsync(key);
    }
}

export default StorageService;