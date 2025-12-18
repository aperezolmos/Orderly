import { apiClient, handleApiError } from './api';


export const authService = {

  login: async (username, password) => {
    try {
      const user = await apiClient.post('/auth/login', {
        username,
        password
      });
      return user;
    } 
    catch (error) {
      return handleApiError(error);
    }
  },
  
  register: async (userData) => {
    try {
      const user = await apiClient.post('/auth/register', userData);
      return user;
    } 
    catch (error) {
      return handleApiError(error);
    }
  },

  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      handleApiError(error);
    }
  },

  getCurrentUser: async () => {
    try {
      return await apiClient.get('/auth/me');
    } catch (error) {
      return handleApiError(error);
    }
  },

  checkAuthStatus: async () => {
    try {
      return await apiClient.get('/auth/me');
    } catch (error) {
      console.log('Auth error:', error);
      return null;
    }
  }
};
