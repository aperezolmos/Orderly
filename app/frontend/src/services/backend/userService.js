import { apiClient, handleApiError } from './api';


export const userService = {
  
  getUsers: async () => {
    try {
      return await apiClient.get('/users');
    } 
    catch (error) {
      return handleApiError(error);
    }
  },

  getUserById: async (id) => {
    try {
      return await apiClient.get(`/users/${id}`);
    } 
    catch (error) {
      return handleApiError(error);
    }
  },

  
  checkUsernameAvailability: async (username) => {
    try {
      return await apiClient.get(`/users/check-username?username=${username}`);
    } 
    catch (error) {
      return handleApiError(error);
    }
  }
};
