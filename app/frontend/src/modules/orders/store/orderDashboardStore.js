import { create } from 'zustand';
import { orderService } from '../../../services/backend/orderService';
import { productService } from '../../../services/backend/productService';


// Helper to build the request DTO according to order type
function toOrderRequestDTO(order, orderType, editedQuantities = {}) {
  const items = Array.isArray(order.items)
    ? order.items.map(item => ({
        productId: item.productId ?? item.product?.id,
        quantity: editedQuantities[item.id] ?? item.quantity,
      }))
    : [];

  const dto = {
    orderNumber: order.orderNumber,
    orderType: orderType === 'bar' ? 'BAR' : 'DINING',
    customerName: order.customerName,
    notes: order.notes,
    employeeId: order.employeeId,
    items,
  };

  if (orderType === 'bar') {
    dto.drinksOnly = order.drinksOnly ?? false;
  }
  if (orderType === 'dining') {
    dto.tableId = order.tableId;
  }

  return dto;
}


export const useOrderDashboardStore = create((set, get) => ({
  // ORDER STATES
  orderType: 'bar', // 'bar' or 'dining'
  orders: [],
  currentOrder: null,
  isLoadingOrdersList: false,
  isLoadingCurrentOrder: false,
  isLoadingOrderDetails: false,
  isUpdatingStatus: false,
  editedQuantities: {},

  // PRODUCT STATES
  products: [],
  isLoadingProducts: false,
  allergenFilter: [],



  // =============================
  // ORDERS - LEFT SECTION
  // =============================

  /**
   * Change order type (bar/dining) and load all orders
   * This is the main loader for the orders section
   */
  setOrderType: async (type) => {
    set({
      orderType: type,
      isLoadingOrdersList: true,
      isLoadingCurrentOrder: true,
      editedQuantities: {},
    });
    await get().fetchOrders(type);
  },

  /**
   * Load pending order list by type
   * Keeps currentOrder updated if it is still valid
   */
  fetchOrders: async (type = get().orderType) => {
    set({ isLoadingOrdersList: true });
    try {
      let orders = [];
      if (type === 'bar') {
        orders = await orderService.getPendingBarOrders();
      } else {
        orders = await orderService.getPendingDiningOrders();
      }

      set({ orders });

      const currentOrder = get().currentOrder;
      let newCurrentOrder = null;

      if (currentOrder && orders.some(o => o.id === currentOrder.id)) {
        // If the current order is still valid, refresh it with details
        set({ isLoadingOrderDetails: true });
        if (type === 'bar') {
          newCurrentOrder = await orderService.getBarOrderById(currentOrder.id);
        } else {
          newCurrentOrder = await orderService.getDiningOrderById(currentOrder.id);
        }
      } 
      else if (orders.length > 0) {
        // Load the first order as current
        set({ isLoadingCurrentOrder: true });
        const firstOrderId = orders[0].id;
        if (type === 'bar') {
          newCurrentOrder = await orderService.getBarOrderById(firstOrderId);
        } else {
          newCurrentOrder = await orderService.getDiningOrderById(firstOrderId);
        }
      }

      set({
        currentOrder: newCurrentOrder
          ? { ...newCurrentOrder, items: Array.isArray(newCurrentOrder.items) ? newCurrentOrder.items : [] }
          : null,
        editedQuantities: {},
        isLoadingOrdersList: false,
        isLoadingCurrentOrder: false,
        isLoadingOrderDetails: false,
      });
    }
    catch (error) {
      set({
        isLoadingOrdersList: false,
        isLoadingCurrentOrder: false,
        isLoadingOrderDetails: false,
      });
      throw error;
    }
  },

  /**
   * Select a specific order to view its details
   * Only loads the current order (without refreshing the list)
   */
  selectOrder: async (orderId) => {
    const { orderType } = get();
    set({ isLoadingCurrentOrder: true, isLoadingOrderDetails: true });

    try {
      let order = null;
      if (orderType === 'bar') {
        order = await orderService.getBarOrderById(orderId);
      } else {
        order = await orderService.getDiningOrderById(orderId);
      }

      set({
        currentOrder: { ...order, items: Array.isArray(order?.items) ? order.items : [] },
        editedQuantities: {},
        isLoadingCurrentOrder: false,
        isLoadingOrderDetails: false,
      });
    } 
    catch (error) {
      set({
        isLoadingCurrentOrder: false,
        isLoadingOrderDetails: false,
      });
      throw error;
    }
  },

  /**
   * Modify quantity locally (does not persist on server)
   */
  setItemQuantity: (itemId, quantity) => {
    set((state) => ({
      editedQuantities: {
        ...state.editedQuantities,
        [itemId]: quantity,
      },
    }));
  },

  /**
   * Save quantity changes (full order update)
   * Reloads current order and list
   */
  updateOrder: async (orderData) => {
    const { currentOrder, orderType, editedQuantities } = get();
    if (!currentOrder) return;

    set({ isLoadingOrderDetails: true });
    try {
      const dto = toOrderRequestDTO(orderData, orderType, editedQuantities);

      if (orderType === 'bar') {
        await orderService.updateBarOrder(currentOrder.id, dto);
      } else {
        await orderService.updateDiningOrder(currentOrder.id, dto);
      }

      // Refresh current order
      let updatedOrder = null;
      if (orderType === 'bar') {
        updatedOrder = await orderService.getBarOrderById(currentOrder.id);
      } else {
        updatedOrder = await orderService.getDiningOrderById(currentOrder.id);
      }

      set({
        currentOrder: { ...updatedOrder, items: Array.isArray(updatedOrder.items) ? updatedOrder.items : [] },
        editedQuantities: {},
      });

      // Refresh the list
      await get().fetchOrders(orderType);
    } 
    catch (error) {
      console.error('Error:', error);
      throw error;
    } 
    finally {
      set({ isLoadingOrderDetails: false });
    }
  },

  /**
   * Change current order status
   */
  updateOrderStatus: async (newStatus) => {
    const { currentOrder, orderType } = get();
    if (!currentOrder?.id || currentOrder.status === newStatus) return;

    set({ isUpdatingStatus: true });
    try {
      await orderService.updateOrderStatus(currentOrder.id, newStatus);

      // Refresh current order
      let updatedOrder = null;
      if (orderType === 'bar') {
        updatedOrder = await orderService.getBarOrderById(currentOrder.id);
      } else {
        updatedOrder = await orderService.getDiningOrderById(currentOrder.id);
      }

      set({
        currentOrder: {
          ...updatedOrder,
          items: Array.isArray(updatedOrder.items) ? updatedOrder.items : [],
        },
      });

      // Refresh the list
      await get().fetchOrders(orderType);

      return updatedOrder;
    } 
    catch (error) {
      console.error('Error:', error);
      throw error;
    } 
    finally {
      set({ isUpdatingStatus: false });
    }
  },

  /**
   * Remove an item from current order
   * Reloads the current order and the list
   */
  removeOrderItem: async (itemId) => {
    const { currentOrder, orderType } = get();
    if (!currentOrder) return;

    set({ isLoadingOrderDetails: true });
    try {
      await orderService.removeItemFromOrder(currentOrder.id, itemId);

      let updatedOrder = null;
      if (orderType === 'bar') {
        updatedOrder = await orderService.getBarOrderById(currentOrder.id);
      } else {
        updatedOrder = await orderService.getDiningOrderById(currentOrder.id);
      }

      set({
        currentOrder: { ...updatedOrder, items: Array.isArray(updatedOrder.items) ? updatedOrder.items : [] },
        editedQuantities: {},
      });

      // Refresh the list
      await get().fetchOrders(orderType);
    } 
    catch (error) {
      console.error('Error:', error);
      throw error;
    } 
    finally {
      set({ isLoadingOrderDetails: false });
    }
  },

  /**
   * Add product to current order
   * Reloads the current order and the list
   */
  addProductToOrder: async (product) => {
    const { currentOrder, orderType } = get();
    if (!currentOrder) return;

    set({ isLoadingOrderDetails: true });
    try {
      await orderService.addItemToOrder(currentOrder.id, { productId: product.id, quantity: 1 });

      let updatedOrder = null;
      if (orderType === 'bar') {
        updatedOrder = await orderService.getBarOrderById(currentOrder.id);
      } else {
        updatedOrder = await orderService.getDiningOrderById(currentOrder.id);
      }

      set({
        currentOrder: { ...updatedOrder, items: Array.isArray(updatedOrder.items) ? updatedOrder.items : [] },
        editedQuantities: {},
      });

      // Refresh the list
      await get().fetchOrders(orderType);
    } 
    catch (error) {
      console.error('Error:', error);
      throw error;
    } 
    finally {
      set({ isLoadingOrderDetails: false });
    }
  },

  /**
   * Create a new order
   * Refresh the list and select the new one
   */
  createOrder: async (dto, orderType) => {
    set({ 
      isLoadingOrdersList: true, 
      isLoadingCurrentOrder: true,
      editedQuantities: {}
    });
    try {
      let createdOrder = null;
      if (orderType === 'bar') {
        createdOrder = await orderService.createBarOrder(dto);
      } else {
        createdOrder = await orderService.createDiningOrder(dto);
      }

      // Refresh the list
      await get().fetchOrders(orderType);

      // Select new order as the current one
      if (createdOrder?.id) {
        await get().selectOrder(createdOrder.id);
      }

      return createdOrder;
    } 
    catch (error) {
      set({ isLoadingOrdersList: false, isLoadingCurrentOrder: false });
      throw error;
    }
  },

  /**
   * Delete an order
   * Refresh the list
   */
  deleteOrder: async (orderId, orderType) => {
    set({ isLoadingOrdersList: true });
    try {
      if (orderType === 'bar') {
        await orderService.deleteBarOrder(orderId);
      } else {
        await orderService.deleteDiningOrder(orderId);
      }
      await get().fetchOrders(orderType);
    } 
    catch (error) {
      set({ isLoadingOrdersList: false });
      throw error;
    }
  },

  // =============================
  // PRODUCTS - RIGHT SECTION
  // =============================

  /**
   * Load products filtered by allergens
   * @param {Array<string>} allergens - Allergens to exclude
   */
  fetchFilteredProducts: async (allergens = get().allergenFilter) => {
    set({ isLoadingProducts: true });
    try {
      const products = await productService.getSafeProducts(allergens);
      set({ products: Array.isArray(products) ? products : [] });
    } 
    catch (error) {
      set({ products: [] });
      throw error;
    } 
    finally {
      set({ isLoadingProducts: false });
    }
  },

  /**
   * Modifies selected allergens for the filter
   */
  setAllergenFilter: (allergens) => set({ allergenFilter: allergens }),

  /**
   * Initial load (without allergen filter)
   */
  fetchProducts: async () => {
    await get().fetchFilteredProducts([]);
  },
}));
