import { apiClient } from './api';


export const userService = {
  
  getUsers: async () => apiClient.get('/users'),
  getUserById: async (id) => apiClient.get(`/users/${id}`),
  getUserByUsername: async (username) => apiClient.get(`/users/username/${username}`),
  createUser: async (userData) => apiClient.post('/users', userData),
  updateUser: async (id, userData) => apiClient.put(`/users/${id}`, userData),
  deleteUser: async (id) => apiClient.delete(`/users/${id}`),
  checkUsernameAvailability: async (username) => apiClient.get('/users/check-username', { username }),


  // ======================
  // ROLES
  // ======================
  setUserRoles: async (userId, roleIds) => apiClient.put(`/users/${userId}/roles`, roleIds),
};
