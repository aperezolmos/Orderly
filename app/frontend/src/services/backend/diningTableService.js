import { apiClient } from './api';


export const diningTableService = {
  
  getTables: async () => apiClient.get('/tables'),
  getActiveTables: async () => apiClient.get('/tables/active'),
  getTableById: async (id) => apiClient.get(`/tables/${id}`),
  createTable: async (tableData) => apiClient.post('/tables', tableData),
  updateTable: async (id, tableData) => apiClient.put(`/tables/${id}`, tableData),
  deleteTable: async (id) => apiClient.delete(`/tables/${id}`),
  checkTableNameAvailability: async (name) => apiClient.get(`/tables/check-name`, { name }),

  updateTableStatus: async (id, status) => {
    if (status === 'ACTIVE') {
      return apiClient.patch(`/tables/${id}/activate`);
    } else if (status === 'INACTIVE') {
      return apiClient.patch(`/tables/${id}/deactivate`);
    }
    throw new Error('Invalid table status');
  },
};
