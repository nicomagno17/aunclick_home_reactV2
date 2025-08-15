// API Base service
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejo global de errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Aquí podríamos implementar lógica global de manejo de errores
    // Por ejemplo, mostrar notificaciones o redireccionar en caso de error 401
    return Promise.reject(error);
  }
);

export default api;