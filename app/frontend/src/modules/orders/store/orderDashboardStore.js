import { create } from 'zustand';
import { orderService } from '../../../services/backend/orderService';
import { productService } from '../../../services/backend/productService';

// Helper para construir el DTO de request según tipo
function toOrderRequestDTO(order, orderType, editedQuantities = {}) {
  const items = Array.isArray(order.items)
    ? order.items.map(item => ({
        productId: item.productId ?? item.product?.id,
        quantity: editedQuantities[item.id] !== undefined ? editedQuantities[item.id] : item.quantity,
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
  orderType: 'bar', // 'bar' or 'dining'
  orders: [],
  currentOrder: null,
  products: [],
  activePage: 1,
  totalPages: 1,
  isLoadingOrders: false,
  isLoadingProducts: false,
  editedQuantities: {}, // { [itemId]: cantidad }

  // Alternar tipo de pedido y cargar pedidos pendientes
  setOrderType: async (type) => {
    set({ orderType: type, isLoadingOrders: true, editedQuantities: {} });
    await get().fetchOrders(type);
  },

  // Cargar pedidos pendientes según tipo
  fetchOrders: async (type = get().orderType) => {
    set({ isLoadingOrders: true });
    let orders = [];
    if (type === 'bar') {
      orders = await orderService.getPendingBarOrders();
    } else {
      orders = await orderService.getPendingDiningOrders();
    }
    set({ orders, isLoadingOrders: false });
    // Seleccionar el primero como actual si no hay ninguno
    const currentOrder = get().currentOrder;
    let newCurrentOrder = null;
    if (currentOrder && orders.some(o => o.id === currentOrder.id)) {
      // Refresca el pedido actual con DTO detallado
      if (type === 'bar') {
        newCurrentOrder = await orderService.getBarOrderById(currentOrder.id);
      } else {
        newCurrentOrder = await orderService.getDiningOrderById(currentOrder.id);
      }
    } else if (orders.length > 0) {
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
    });
  },

  // Seleccionar pedido actual
  selectOrder: async (orderId) => {
    const { orderType } = get();
    let order = null;
    if (orderType === 'bar') {
      order = await orderService.getBarOrderById(orderId);
    } else {
      order = await orderService.getDiningOrderById(orderId);
    }
    set({
      currentOrder: { ...order, items: Array.isArray(order?.items) ? order.items : [] },
      editedQuantities: {},
    });
  },

  // Modificar cantidad localmente (no persiste aún)
  setItemQuantity: (itemId, quantity) => {
    set((state) => ({
      editedQuantities: {
        ...state.editedQuantities,
        [itemId]: quantity,
      },
    }));
  },

  // Guardar cambios de cantidades (update completo)
  updateOrder: async (orderData) => {
    const { currentOrder, orderType, editedQuantities } = get();
    if (!currentOrder) return;
    const dto = toOrderRequestDTO(orderData, orderType, editedQuantities);
    let updatedOrder = null;
    if (orderType === 'bar') {
      await orderService.updateBarOrder(currentOrder.id, dto);
      updatedOrder = await orderService.getBarOrderById(currentOrder.id);
    } else {
      await orderService.updateDiningOrder(currentOrder.id, dto);
      updatedOrder = await orderService.getDiningOrderById(currentOrder.id);
    }
    set({
      currentOrder: { ...updatedOrder, items: Array.isArray(updatedOrder.items) ? updatedOrder.items : [] },
      editedQuantities: {},
    });
    // Refresca la lista pero mantén el actual
    await get().fetchOrders(orderType);
  },

  // Eliminar ítem del pedido actual
  removeOrderItem: async (itemId) => {
    const { currentOrder, orderType } = get();
    if (!currentOrder) return;
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
    await get().fetchOrders(orderType);
  },

  // Añadir producto como ítem al pedido actual
  addProductToOrder: async (product) => {
    const { currentOrder, orderType } = get();
    if (!currentOrder) return;
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
    await get().fetchOrders(orderType);
  },
  

  // PRODUCTS (right section)
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

  // Crear pedido
  createOrder: async (dto, orderType) => {
    let createdOrder = null;
    if (orderType === 'bar') {
      createdOrder = await orderService.createBarOrder(dto);
    } 
    else {
      createdOrder = await orderService.createDiningOrder(dto);
    }
    // Refresca la lista y selecciona el nuevo pedido
    await get().fetchOrders(orderType);
    if (createdOrder?.id) {
      await get().selectOrder(createdOrder.id);
    }
    return createdOrder;
  },
}));
