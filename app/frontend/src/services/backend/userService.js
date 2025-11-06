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

  getUserByUsername: async (username) => {
    try {
      return await apiClient.get(`/users/username/${username}`);
    } 
    catch (error) {
      return handleApiError(error);
    }
  },

  createUser: async (userData) => {
    try {
      return await apiClient.post('/users', userData);
    } 
    catch (error) {
      return handleApiError(error);
    }
  },

  updateUser: async (id, userData) => {
    try {
      return await apiClient.put(`/users/${id}`, userData);
    } 
    catch (error) {
      return handleApiError(error);
    }
  },

  deleteUser: async (id) => {
    try {
      return await apiClient.delete(`/users/${id}`);
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
  },

  setUserRoles: async (userId, roleIds) => {
    try {
      return await apiClient.put(`/users/${userId}/roles`, roleIds);
    } 
    catch (error) {
      return handleApiError(error);
    }
  }
};
