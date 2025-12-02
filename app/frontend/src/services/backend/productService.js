import { apiClient, handleApiError } from './api';


export const productService = {
  
  getProducts: async () => {
    try {
      return apiClient.get('/products');
    }
    catch (error) {
      return handleApiError(error);
    }
  },
  
  getProductById: async (id, { detailed = false, includeIngredients = false } = {}) => {
    
    try {
      let url = `/products/${id}`;
      const params = [];
      if (detailed) params.push('detailed=true');
      if (includeIngredients) params.push('includeIngredients=true');
      if (params.length) url += '?' + params.join('&');
      return await apiClient.get(url);
    }
    catch (error) {
      return handleApiError(error);
    }
  },
  
  createProduct: async (productData) => {
    try {
      return await apiClient.post('/products', productData);
    }
    catch (error) {
      return handleApiError(error);
    }
  },
  
  updateProduct: async (id, productData) => {
    try {
      return await apiClient.put(`/products/${id}`, productData);
    }
    catch (error) {
      return handleApiError(error);
    }
  },
  
  deleteProduct: async (id) => {
    try {
      return apiClient.delete(`/products/${id}`);
    }
    catch (error) {
      return handleApiError(error);
    }
  },


  addIngredient: async (productId, foodId, quantityInGrams) => {
    try {
      return await apiClient.post(`/products/${productId}/ingredients`, {
        foodId,
        quantityInGrams,
      });
    }
    catch (error) {
      return handleApiError(error);
    }
  },
  
  updateIngredientQuantity: async (productId, foodId, quantityInGrams) => {
    try {
      return await apiClient.put(`/products/${productId}/ingredients/${foodId}?quantity=${quantityInGrams}`);
    }
    catch (error) {
      return handleApiError(error);
    }
  },
  
  removeIngredient: async (productId, foodId) => {
    try {
      return await apiClient.delete(`/products/${productId}/ingredients/${foodId}`);
    }
    catch (error) {
      return handleApiError(error);
    }
  },
  
  getIngredients: async (productId) => {
    try {
      return await apiClient.get(`/products/${productId}/ingredients`);
    }
    catch (error) {
      return handleApiError(error);
    }
  },
};
