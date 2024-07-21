// axios interceptor to add correct access headers with every request

import axios from "axios";
import { ACCESS_TOKEN } from "./constants";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            console.log("Token found in interceptor:", token);
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            console.warn("Token not found in interceptor");
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;