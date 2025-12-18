import { apiClient } from './api';


export const foodService = {
  getFoods: async () => apiClient.get('/foods'),
  getFoodById: async (id) => apiClient.get(`/foods/${id}`),
  searchFoods: async (name) => apiClient.get('/foods/search', { name }),
  createFood: async (foodData) => apiClient.post('/foods', foodData),
  updateFood: async (id, foodData) => apiClient.put(`/foods/${id}`, foodData),
  deleteFood: async (id) => apiClient.delete(`/foods/${id}`),
  checkFoodNameAvailability: async (name) => apiClient.get(`/foods/name/${encodeURIComponent(name)}/exists`),
};
