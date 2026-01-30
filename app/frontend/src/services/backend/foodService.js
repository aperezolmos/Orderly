import { apiClient } from './api';


export const foodService = {
  
  getFoods: async () => apiClient.get('/foods'),
  getFoodById: async (id) => apiClient.get(`/foods/${id}`),
  searchFoods: async (name) => apiClient.get('/foods/search', { name }),
  createFood: async (foodData) => apiClient.post('/foods', foodData),
  updateFood: async (id, foodData) => apiClient.put(`/foods/${id}`, foodData),
  deleteFood: async (id) => apiClient.delete(`/foods/${id}`),
  checkFoodNameAvailability: async (name) => apiClient.get(`/foods/check-name`, { name }),


  // ======================
  // ALLERGENS
  // ======================
  getAllAllergens: async () => apiClient.get('/foods/allergens'),


  // ======================
  // EXTERNAL API (OFF)
  // ======================
  searchFoodFromExternalAPI: async (query, page) => apiClient.get('/foods/external/search', { query, page }),
  createFoodFromExternalAPIBarcode: async (barcode) => apiClient.post(`/foods/external/${barcode}`),
};
