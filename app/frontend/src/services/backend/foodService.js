import { apiClient, handleApiError } from './api';


export const foodService = {
  
  getFoods: async () => {
    try {
      return await apiClient.get('/foods');
    }
    catch (error) {
      return handleApiError(error);
    }
  },

  getFoodById: async (id) => {
    try {
      return await apiClient.get(`/foods/${id}`);
    }
    catch (error) {
      return handleApiError(error);
    }
  },

  createFood: async (foodData) => {
    try {
      return await apiClient.post('/foods', foodData);
    }
    catch (error) {
      return handleApiError(error);
    }
  },

  updateFood: async (id, foodData) => {
    try {
      return await apiClient.put(`/foods/${id}`, foodData);
    }
    catch (error) {
      return handleApiError(error);
    }
  },

  deleteFood: async (id) => {
    try {
      return await apiClient.delete(`/foods/${id}`);
    }
    catch (error) {
      return handleApiError(error);
    }
  },

  checkFoodNameAvailability: async (name) => {
    try {
      return !await apiClient.get(`/foods/name/${encodeURIComponent(name)}/exists`);
    }
    catch (error) {
      return handleApiError(error);
    }
  },

  searchFoods: async (name) => {
    return await apiClient.get(`/foods/search?name=${encodeURIComponent(name)}`);
  }
};
