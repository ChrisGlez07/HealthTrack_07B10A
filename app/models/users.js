//https://healthtrack-1-uxq3.onrender.com

import axios from "axios";
// import { getToken } from "../helpers/StorageService";

//crear la instancia axios

const api = axios.create({
    baseURL: "https://healthtrack-1-uxq3.onrender.com/api",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

// api.interceptors.request.use(
//     async (config) => {
//         try {
//             const token = await getToken("JWTToken");
//             //Solo si el token existe, lo agregamos a header

//             if ( token !== null) {
//                 config.headers.Authorization = `Bearer ${token}`;
//             }
//             return config;

//         } catch (error) {
//             return Promise.reject(error);
//         }

//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// )

export default api;