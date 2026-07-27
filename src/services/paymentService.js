import api from './api'

const paymentService = {
  initialize: (orderId) => api.post('/payments/initialize', { orderId }),
}

export default paymentService
