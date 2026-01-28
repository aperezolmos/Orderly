import { apiClient } from './api';


export const productService = {
  
  getProducts: async () => apiClient.get('/products'),
  
  getProductById: async (id, { detailed = false, includeIngredients = false } = {}) => {
    let url = `/products/${id}`;
    const params = {};
    if (detailed) params.detailed = true;
    if (includeIngredients) params.includeIngredients = true;
    return apiClient.get(url, Object.keys(params).length ? params : undefined);
  },

  getSafeProducts: async (allergensToExclude) => {
    const params = { exclude: (allergensToExclude || []).join(',') };
    return apiClient.get('/products/filter-safe', params);
  },
  
  createProduct: async (productData) => apiClient.post('/products', productData),
  updateProduct: async (id, productData) => apiClient.put(`/products/${id}`, productData),
  deleteProduct: async (id) => apiClient.delete(`/products/${id}`),
  checkProductNameAvailability: async (name) => apiClient.get(`/products/check-name`, { name }),


  // ======================
  // INGREDIENTS
  // ======================
  addIngredient: async (productId, foodId, quantityInGrams) =>
    apiClient.post(`/products/${productId}/ingredients`, { foodId, quantityInGrams }),
  
  updateIngredientQuantity: async (productId, foodId, quantityInGrams) =>
    apiClient.put(`/products/${productId}/ingredients/${foodId}?quantity=${quantityInGrams}`),
  
  removeIngredient: async (productId, foodId) =>
    apiClient.delete(`/products/${productId}/ingredients/${foodId}`),
  
  getIngredients: async (productId) => apiClient.get(`/products/${productId}/ingredients`),
};
