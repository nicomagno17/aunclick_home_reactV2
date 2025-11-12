import axios from 'axios'

const api = axios.create({
  baseURL: '',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para requests
api.interceptors.request.use(
  (config) => {
    // Aquí puedes agregar tokens de autenticación, etc.
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para responses
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Manejo de errores globales
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

export default api