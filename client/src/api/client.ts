import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
    baseURL: `${API_URL}/api`,
    withCredentials: true,
});

export const authApi = axios.create({
    baseURL: `${API_URL}/api/auth`,
    withCredentials: true,
});

export default api;
