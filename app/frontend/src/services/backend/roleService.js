import { apiClient, handleApiError } from './api';


export const roleService = {
  
  getRoles: async () => {
    try {
      return await apiClient.get('/roles');
    } 
    catch (error) {
      return handleApiError(error);
    }
  },

  getRoleById: async (id) => {
    try {
      return await apiClient.get(`/roles/${id}`);
    } 
    catch (error) {
      return handleApiError(error);
    }
  },

  getRoleByName: async (name) => {
    try {
      return await apiClient.get(`/roles/name/${name}`);
    } 
    catch (error) {
      return handleApiError(error);
    }
  },

  createRole: async (roleData) => {
    try {
      return await apiClient.post('/roles', roleData);
    } 
    catch (error) {
      return handleApiError(error);
    }
  },

  updateRole: async (id, roleData) => {
    try {
      return await apiClient.put(`/roles/${id}`, roleData);
    } 
    catch (error) {
      return handleApiError(error);
    }
  },

  deleteRole: async (id) => {
    try {
      return await apiClient.delete(`/roles/${id}`);
    } 
    catch (error) {
      return handleApiError(error);
    }
  },

  existsByName: async (name) => {
    try {
      return await apiClient.get(`/roles/name/${name}/exists`);
    } 
    catch (error) {
      return handleApiError(error);
    }
  },

  getAllPermissions: async () => {
    try {
      return await apiClient.get('/roles/permissions');
    } 
    catch (error) {
      return handleApiError(error);
    }
  },

  setRolePermissions: async (roleId, permissions) => {
    try {
      return await apiClient.put(`/roles/${roleId}/permissions`, permissions);
    } 
    catch (error) {
      return handleApiError(error);
    }
  },
};