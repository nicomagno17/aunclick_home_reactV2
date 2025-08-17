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
    
    // Mejorar el log del error para incluir detalles de la respuesta
    if (error.response) {
      console.error('Error data:', error.response.data)
      console.error('Error status:', error.response.status)
      console.error('Error headers:', error.response.headers)
    } else if (error.request) {
      console.error('No se recibió respuesta:', error.request)
    } else {
      console.error('Error de configuración:', error.message)
    }
    
    return Promise.reject(error)
  }
)

export default api