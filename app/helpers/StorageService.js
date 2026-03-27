import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';

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
             console.log("Guardando en AsyncStorage:", {key, value});
            const jsonValue = JSON.stringify(value);
            console.log("Guardando en AsyncStorage:", jsonValue);
            await AsyncStorage.setItem(key, jsonValue);
        } catch (error) {
            console.error("Error guardando en AsyncStorage:", error);
        }
    }

    static async getItem(key){
        try {
            const jsonvalue = await AsyncStorage.getItem(key);
            return jsonvalue != null ? JSON.parse(jsonvalue) : null;
        } catch (error) {
            console.error("Error al obtener datos en AsyncStorage:", error);
        }
    }

    //KEYCHAIN-Sensititve data storage

    static async saveCredentials(username, token){
        try {
           await Keychain.setGenericPassword(username, token);
           return true;
        }catch (error) {
            console.error("Error en Keychain:", error);
        }
    }

    //KEYCHAIN-Sensititve data get

    static async getCredentials(){
        try {
            const credentials = await Keychain.getGenericPassword();
            if (credentials){
                return {user: credentials.username, token: credentials.password};
            }
            return null;
        } catch (error) {
            console.error("No se pudieron recuperar las credenciales", error);
        }
    }

    static async resetCredentials(){
        await Keychain.resetGenericPassword();
    }
}

export default StorageService;