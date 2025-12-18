import { apiClient } from './api';


export const authService = {

  login: async (username, password) =>
    apiClient.post('/auth/login', { username, password }),

  register: async (userData) =>
    apiClient.post('/auth/register', userData),

  logout: async () => {
    await apiClient.post('/auth/logout');
  },

  getCurrentUser: async () => apiClient.get('/auth/me'),

  checkAuthStatus: async () => {
    try {
      return await apiClient.get('/auth/me');
    }
    catch { return null; }
  },
};
