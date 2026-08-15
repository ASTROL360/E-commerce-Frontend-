import api from './api'

export const GOOGLE_AUTH_URL = 'https://ecommerce-backend-jdp8.onrender.com/oauth2/authorization/google'

const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (name, email, password) => api.post('/auth/register', { name, email, password }),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (pin, newPassword) => api.post('/auth/reset-password', { pin, newPassword }),
  getProfile: () => api.get('/users/profile'),
}

export default authService
