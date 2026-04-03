//Final App

import axios from "axios";
import StorageService from "../helpers/StorageService";

const api = axios.create({
    baseURL: "https://healthtrack-hnsx.onrender.com/api",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    async (config) => {
        try {
            if (config.url.includes("/login" ) || config.url.includes("/register/paciente")) {
                return config;
            }

            const token = await StorageService.getToken("userToken");
            console.log("Token obtenido para ruta", config.url, ":", token ? "Sí existe" : "No existe");
            
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
                console.log("Token agregado a la petición:", config.url);
            } else {
                console.log(" No hay token disponible para:", config.url);
            }
            
            return config;
        } catch (error) {
            console.error("Error en interceptor:", error);
            return Promise.reject(error);
        }
    },
    (error) => {
        console.error("Error en interceptor response:", error);
        return Promise.reject(error);
    }
);

export default api;