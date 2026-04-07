//Final App

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

class StorageService {
    //REGEX
    //Common patterns
    static patterns = {
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d\W_]{8,}$/,
        date: /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4} ([01][0-9]|2[0-3]):([0-5][0-9])$/,
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