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
    // Only clears local state
    // TODO: aquí iría una llamada al backend para invalidar sesión
    return Promise.resolve();
  },

  checkAuthStatus: async () => {
    //TODO: se podría usar /auth/status o /auth/me¿?
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }
};
