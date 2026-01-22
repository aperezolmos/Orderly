import { apiClient } from './api';


export const authService = {

  login: async (username, password) =>
    apiClient.post('/auth/login', { username, password }),

  register: async (userData) =>
    apiClient.post('/auth/register', userData),

  logout: async () => {
    await apiClient.post('/auth/logout');
  },

  getCurrentUser: async () => {
    try {
      return await apiClient.get('/auth/me');
    } 
    catch (error) {
      if (error.status === 401) return null;
      throw error;
    }
  },

  getCurrentUserPermissions: async () => apiClient.get('/auth/me/permissions'),
};
