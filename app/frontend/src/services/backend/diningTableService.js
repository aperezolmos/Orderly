import { apiClient } from './api';


export const diningTableService = {
  
  getTables: async () => apiClient.get('/tables'),
  getTableById: async (id) => apiClient.get(`/tables/${id}`),
  createTable: async (tableData) => apiClient.post('/tables', tableData),
  updateTable: async (id, tableData) => apiClient.put(`/tables/${id}`, tableData),
  deleteTable: async (id) => apiClient.delete(`/tables/${id}`),
};
