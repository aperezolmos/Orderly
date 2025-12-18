import { apiClient } from './api';


export const orderService = {
  
  // ======================
  // ORDER (GENERAL)
  // ======================
  getAllOrders: async () => apiClient.get('/orders'),
  getOrderById: async (id) => apiClient.get(`/orders/${id}`),
  getOrderByNumber: async (orderNumber) => apiClient.get(`/orders/orderNumber/${orderNumber}`),
  searchOrders: async ({ status, employeeId, since } = {}) =>
    apiClient.get('/orders/search', { status, employeeId, since }),
  updateOrderStatus: async (id, status) => apiClient.patch(`/orders/${id}/status?status=${status}`),
  cancelOrder: async (id) => apiClient.patch(`/orders/${id}/cancel`),
  markOrderAsPaid: async (id) => apiClient.patch(`/orders/${id}/paid`),
  checkOrderExists: async (id) => apiClient.get(`/orders/${id}/exists`),


  // ======================
  // ORDER ITEMS
  // ======================
  addItemToOrder: async (orderId, itemRequest) => apiClient.post(`/orders/${orderId}/items`, itemRequest),
  removeItemFromOrder: async (orderId, itemId) => apiClient.delete(`/orders/${orderId}/items/${itemId}`),
  getAllPendingOrderItems: async () => apiClient.get('/orders/items/pending'),
  getOrderItemById: async (id) => apiClient.get(`/orders/items/${id}`),
  getOrderItemsByOrderId: async (orderId) => apiClient.get(`/orders/${orderId}/items`),
  updateOrderItemStatus: async (id, status) => apiClient.patch(`/orders/items/${id}/status?status=${status}`),


  // ======================
  // BAR ORDER
  // ======================
  getBarOrders: async ({ drinksOnly, status } = {}) =>
    apiClient.get('/orders/bar', { drinksOnly, status }),
  getBarOrderById: async (id) => apiClient.get(`/orders/bar/${id}`),
  getBarOrdersByEmployee: async (employeeId) => apiClient.get(`/orders/bar/employee/${employeeId}`),
  getBarOrdersByDateRange: async (start, end) => apiClient.get('/orders/bar/date-range', { start, end }),
  getPendingBarOrders: async () => apiClient.get('/orders/bar/pending'),
  getTodayBarOrders: async () => apiClient.get('/orders/bar/today'),
  createBarOrder: async (orderRequest) => apiClient.post('/orders/bar', orderRequest),
  updateBarOrder: async (id, orderRequest) => apiClient.put(`/orders/bar/${id}`, orderRequest),
  deleteBarOrder: async (id) => apiClient.delete(`/orders/bar/${id}`),


  // ======================
  // DINING ORDER
  // ======================
  getDiningOrders: async ({ tableId, status } = {}) =>
    apiClient.get('/orders/dining', { tableId, status }),
  getDiningOrderById: async (id) => apiClient.get(`/orders/dining/${id}`),
  getDiningOrdersByEmployee: async (employeeId) => apiClient.get(`/orders/dining/employee/${employeeId}`),
  getDiningOrdersByDateRange: async (start, end) => apiClient.get('/orders/dining/date-range', { start, end }),
  getTablesWithActiveOrders: async () => apiClient.get('/orders/dining/active-tables'),
  getPendingDiningOrders: async () => apiClient.get('/orders/dining/pending'),
  getTodayDiningOrders: async () => apiClient.get('/orders/dining/today'),
  createDiningOrder: async (orderRequest) => apiClient.post('/orders/dining', orderRequest),
  updateDiningOrder: async (id, orderRequest) => apiClient.put(`/orders/dining/${id}`, orderRequest),
  deleteDiningOrder: async (id) => apiClient.delete(`/orders/dining/${id}`),
};
