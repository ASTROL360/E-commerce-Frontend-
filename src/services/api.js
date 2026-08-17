import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')

      const currentPath = `${window.location.pathname}${window.location.search}${window.location.hash}`
      const authPages = ['/login', '/register', '/forgot-password', '/reset-password']

      if (!authPages.includes(window.location.pathname)) {
        window.location.assign(`/login?returnUrl=${encodeURIComponent(currentPath)}`)
      }
    }
    return Promise.reject(error)
  }
)

export function unwrap(res) {
  return res.data?.data ?? res.data ?? null;
}

export default api
