import api from './api'

const orderService = {
  checkoutFromCart: (addressId) => api.post('/orders/checkout', { addressId }),
  getById: (id) => api.get(`/orders/${id}`),
  getMyOrders: (params = {}) => api.get('/orders', { params }),
  getAllOrders: (params = {}) => api.get('/orders/admin/all', { params }),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
}

export default orderService
