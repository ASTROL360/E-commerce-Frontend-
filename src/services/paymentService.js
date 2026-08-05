import api from './api'

const paymentService = {
  initialize: (orderId, callbackUrl) => api.post('/payments/initialize', { orderId, callbackUrl }),
  verify: (reference) => api.get(`/payments/verify/${reference}`),
}

export default paymentService
