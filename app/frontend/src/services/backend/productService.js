import { apiClient } from './api';


export const productService = {
  
  getProducts: async () => apiClient.get('/products'),
  
  getProductById: async (id, { detailed = false, includeIngredients = false } = {}) => { //TODO: cambiar
    let url = `/products/${id}`;
    const params = {};
    if (detailed) params.detailed = true;
    if (includeIngredients) params.includeIngredients = true;
    return apiClient.get(url, Object.keys(params).length ? params : undefined);
  },
  
  createProduct: async (productData) => apiClient.post('/products', productData),
  updateProduct: async (id, productData) => apiClient.put(`/products/${id}`, productData),
  deleteProduct: async (id) => apiClient.delete(`/products/${id}`),


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
