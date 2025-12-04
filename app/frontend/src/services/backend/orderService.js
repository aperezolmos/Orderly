import { apiClient, handleApiError } from './api';


export const orderService = {
  
  // ======================
  // ORDER (GENERAL)
  // ======================
  
  getAllOrders: async () => {
    try {
      return await apiClient.get('/orders');
    } 
    catch (error) {
      return handleApiError(error);
    }
  },

  getOrderById: async (id) => {
    try {
      return await apiClient.get(`/orders/${id}`);
    } 
    catch (error) {
      return handleApiError(error);
    }
  },

  getOrderByNumber: async (orderNumber) => {
    try {
      return await apiClient.get(`/orders/orderNumber/${orderNumber}`);
    } 
    catch (error) {
      return handleApiError(error);
    }
  },

  searchOrders: async ({ status, employeeId, since } = {}) => {
    try {
      const params = new URLSearchParams(); //TODO: modificar GET en 'api.js' para que admita varios parámetros
      
      if (status) params.append('status', status);
      if (employeeId) params.append('employeeId', employeeId);
      if (since) params.append('since', since);
      
      const queryString = params.toString();
      const url = `/orders/search${queryString ? `?${queryString}` : ''}`;
      
      return await apiClient.get(url);
    } 
    catch (error) {
      return handleApiError(error);
    }
  },

  updateOrderStatus: async (id, status) => {
    try {
      return await apiClient.patch(`/orders/${id}/status?status=${status}`);
    } 
    catch (error) {
      return handleApiError(error);
    }
  },

  cancelOrder: async (id) => {
    try {
      return await apiClient.patch(`/orders/${id}/cancel`);
    } 
    catch (error) {
      return handleApiError(error);
    }
  },

  markOrderAsPaid: async (id) => {
    try {
      return await apiClient.patch(`/orders/${id}/paid`);
    } 
    catch (error) {
      return handleApiError(error);
    }
  },

  checkOrderExists: async (id) => {
    try {
      return await apiClient.get(`/orders/${id}/exists`);
    } 
    catch (error) {
      return handleApiError(error);
    }
  },


  // ======================
  // ORDER ITEMS
  // ======================

  addItemToOrder: async (orderId, itemRequest) => {
    try {
      return await apiClient.post(`/orders/${orderId}/items`, itemRequest);
    } 
    catch (error) {
      return handleApiError(error);
    }
  },

  removeItemFromOrder: async (orderId, itemId) => {
    try {
      return await apiClient.delete(`/orders/${orderId}/items/${itemId}`);
    } 
    catch (error) {
      return handleApiError(error);
    }
  },

  getAllPendingOrderItems: async () => {
    try {
      return await apiClient.get('/orders/items/pending');
    } 
    catch (error) {
      return handleApiError(error);
    }
  },

  getOrderItemById: async (id) => {
    try {
      return await apiClient.get(`/orders/items/${id}`);
    } 
    catch (error) {
      return handleApiError(error);
    }
  },

  getOrderItemsByOrderId: async (orderId) => {
    try {
      return await apiClient.get(`/orders/${orderId}/items`);
    } 
    catch (error) {
      return handleApiError(error);
    }
  },

  updateOrderItemStatus: async (id, status) => {
    try {
      return await apiClient.patch(`/orders/items/${id}/status?status=${status}`);
    } 
    catch (error) {
      return handleApiError(error);
    }
  },


  // ======================
  // BAR ORDER
  // ======================

  getBarOrders: async ({ drinksOnly, status } = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (drinksOnly !== undefined) params.append('drinksOnly', drinksOnly);
      if (status) params.append('status', status);
      
      const queryString = params.toString();
      const url = `/orders/bar${queryString ? `?${queryString}` : ''}`;
      
      return await apiClient.get(url);
    } 
    catch (error) {
      return handleApiError(error);
    }
  },

  getBarOrderById: async (id) => {
    try {
      return await apiClient.get(`/orders/bar/${id}`);
    } 
    catch (error) {
      return handleApiError(error);
    }
  },

  getBarOrdersByEmployee: async (employeeId) => {
    try {
      return await apiClient.get(`/orders/bar/employee/${employeeId}`);
    } 
    catch (error) {
      return handleApiError(error);
    }
  },

  getBarOrdersByDateRange: async (start, end) => {
    try {
      return await apiClient.get(`/orders/bar/date-range?start=${start}&end=${end}`);
    } 
    catch (error) {
      return handleApiError(error);
    }
  },

  getPendingBarOrders: async () => {
    try {
      return await apiClient.get('/orders/bar/pending');
    } 
    catch (error) {
      return handleApiError(error);
    }
  },

  getTodayBarOrders: async () => {
    try {
      return await apiClient.get('/orders/bar/today');
    } 
    catch (error) {
      return handleApiError(error);
    }
  },

  createBarOrder: async (orderRequest) => {
    try {
      return await apiClient.post('/orders/bar', orderRequest);
    } 
    catch (error) {
      return handleApiError(error);
    }
  },

  updateBarOrder: async (id, orderRequest) => {
    try {
      return await apiClient.put(`/orders/bar/${id}`, orderRequest);
    } 
    catch (error) {
      return handleApiError(error);
    }
  },

  deleteBarOrder: async (id) => {
    try {
      return await apiClient.delete(`/orders/bar/${id}`);
    } 
    catch (error) {
      return handleApiError(error);
    }
  },


  // ======================
  // DINING ORDER
  // ======================

  getDiningOrders: async ({ tableId, status } = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (tableId) params.append('tableId', tableId);
      if (status) params.append('status', status);
      
      const queryString = params.toString();
      const url = `/orders/dining${queryString ? `?${queryString}` : ''}`;
      
      return await apiClient.get(url);
    } 
    catch (error) {
      return handleApiError(error);
    }
  },

  getDiningOrderById: async (id) => {
    try {
      return await apiClient.get(`/orders/dining/${id}`);
    } 
    catch (error) {
      return handleApiError(error);
    }
  },

  getDiningOrdersByEmployee: async (employeeId) => {
    try {
      return await apiClient.get(`/orders/dining/employee/${employeeId}`);
    } 
    catch (error) {
      return handleApiError(error);
    }
  },

  getDiningOrdersByDateRange: async (start, end) => {
    try {
      return await apiClient.get(`/orders/dining/date-range?start=${start}&end=${end}`);
    } 
    catch (error) {
      return handleApiError(error);
    }
  },

  getTablesWithActiveOrders: async () => {
    try {
      return await apiClient.get('/orders/dining/active-tables');
    } 
    catch (error) {
      return handleApiError(error);
    }
  },

  getPendingDiningOrders: async () => {
    try {
      return await apiClient.get('/orders/dining/pending');
    } 
    catch (error) {
      return handleApiError(error);
    }
  },

  getTodayDiningOrders: async () => {
    try {
      return await apiClient.get('/orders/dining/today');
    } 
    catch (error) {
      return handleApiError(error);
    }
  },

  createDiningOrder: async (orderRequest) => {
    try {
      return await apiClient.post('/orders/dining', orderRequest);
    } 
    catch (error) {
      return handleApiError(error);
    }
  },

  updateDiningOrder: async (id, orderRequest) => {
    try {
      return await apiClient.put(`/orders/dining/${id}`, orderRequest);
    } 
    catch (error) {
      return handleApiError(error);
    }
  },

  deleteDiningOrder: async (id) => {
    try {
      return await apiClient.delete(`/orders/dining/${id}`);
    } 
    catch (error) {
      return handleApiError(error);
    }
  },
};
