import axios from 'axios';

// Detect if dev or prod
// In dev (Vite), we proxy or point to localhost:8000
// In prod (Static), we use relative / or current origin
// For simplicity, let's look at window.location
const BASE_URL = import.meta.env.DEV ? 'http://localhost:8000' : '';

const api = axios.create({
    baseURL: BASE_URL,
});

export default api;
