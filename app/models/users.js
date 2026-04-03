//Final App

import axios from "axios";
import StorageService from "../helpers/StorageService";

const api = axios.create({
    baseURL: "https://healthtrack-1-uxq3.onrender.com/api",
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
            
            console.log(`\n ===== ${config.url} =====`);
            console.log(`Token: ${token || "NO EXISTE"}`);
            
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
                console.log(`Header Authorization: Bearer ${token.substring(0, 30)}...`);
            }
            
            if (config.data) {
                console.log(`Body:`, config.data);
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