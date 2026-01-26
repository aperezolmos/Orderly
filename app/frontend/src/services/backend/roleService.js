import { apiClient } from './api';


export const roleService = {

  getRoles: async () => apiClient.get('/roles'),
  getRoleById: async (id) => apiClient.get(`/roles/${id}`),
  getRoleByName: async (name) => apiClient.get(`/roles/name/${name}`),
  createRole: async (roleData) => apiClient.post('/roles', roleData),
  updateRole: async (id, roleData) => apiClient.put(`/roles/${id}`, roleData),
  deleteRole: async (id) => apiClient.delete(`/roles/${id}`),
  checkRoleNameAvailability: async (name) => apiClient.get(`/roles/check-name`, { name }),


  // ======================
  // PERMISSIONS
  // ======================
  getAllPermissions: async () => apiClient.get('/roles/permissions'),
  setRolePermissions: async (roleId, permissions) => apiClient.put(`/roles/${roleId}/permissions`, permissions),
};