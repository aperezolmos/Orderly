import { create } from 'zustand';
import { productService } from '../../../services/backend/productService';


export const useOrderDashboardStore = create((set, get) => ({
  products: [],
  activePage: 1,
  totalPages: 1,
  isLoadingProducts: false,

  // Products (right section)
  fetchProducts: async (page = 1, itemsPerPage = 10) => {
    set({ isLoadingProducts: true });
    const res = await productService.getProducts();
    // TODO: Paginate manually (API does not paginate yet)
    const products = res.slice((page - 1) * itemsPerPage, page * itemsPerPage);
    set({
      products,
      activePage: page,
      totalPages: Math.ceil(res.length / itemsPerPage),
      isLoadingProducts: false,
    });
  },

  setActivePage: async (page) => {
    await get().fetchProducts(page);
  },

  addProductToOrder: async (product) => {
    console.log('Añadir producto al pedido:', product);
  },

}));
