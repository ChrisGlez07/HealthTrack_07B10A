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
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            
            return config;
        } catch (error) {
            return Promise.reject(error);
        }
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;