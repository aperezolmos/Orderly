import { apiClient, handleApiError } from './api';


export const diningTableService = {

  getTables: async () => {
    try {
      return await apiClient.get('/tables');
    } 
    catch (error) {
      return handleApiError(error);
    }
  },

  getTableById: async (id) => {
    try {
      return await apiClient.get(`/tables/${id}`);
    } 
    catch (error) {
      return handleApiError(error);
    }
  },

  createTable: async (tableData) => {
    try {
      return await apiClient.post('/tables', tableData);
    } 
    catch (error) {
      return handleApiError(error);
    }
  },

  updateTable: async (id, tableData) => {
    try {
      return await apiClient.put(`/tables/${id}`, tableData);
    } 
    catch (error) {
      return handleApiError(error);
    }
  },

  deleteTable: async (id) => {
    try {
      return await apiClient.delete(`/tables/${id}`);
    } 
    catch (error) {
      return handleApiError(error);
    }
  }
};
