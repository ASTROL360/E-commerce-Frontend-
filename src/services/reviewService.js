import api from './api'

const reviewService = {
  getByProduct: (productId, params = {}) => api.get(`/products/${productId}/reviews`, { params }),
  create: (productId, data) => api.post(`/products/${productId}/reviews`, data),
  update: (reviewId, data) => api.put(`/reviews/${reviewId}`, data),
  remove: (reviewId) => api.delete(`/reviews/${reviewId}`),
}

export default reviewService
