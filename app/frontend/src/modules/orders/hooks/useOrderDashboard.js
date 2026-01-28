import { useEffect } from 'react';
import { useOrderDashboardStore } from '../store/orderDashboardStore';
import { useLoadingNotification } from '../../../common/hooks/useLoadingNotification';


/**
 * Hook that encapsulates the logic for loading orders and products with notifications
 * MUST be used only on OrderDashboardPage (the root component of the dashboard)
 * 
 * Responsibilities:
 * - Initialize orders when the page is set up
 * - Initialize products when the page is set up
 * - Display progress notifications
 * - Sync order type changes
 * - Sync product page changes
 * 
 * This hook only initializes (does not return). Components access the store directly
 */
export function useOrderDashboard() {
  
  const {
    orderType,
    fetchOrders,
    fetchProducts,
  } = useOrderDashboardStore();

  const { showProgressNotification } = useLoadingNotification();


  // INIT: Load orders in page set up
  useEffect(() => {
    const loadOrders = async () => {
      try {
        await showProgressNotification(
          'orders_load_init',
          'orders:notifications.loadingOrders',
          () => fetchOrders(orderType)
        );
      } 
      catch (error) {
        console.error('Error loading orders:', error);
      }
    };

    loadOrders();
  }, [orderType]); // Triggers when the order type changes (bar/dining)


  // INIT: Load products in page set up
  useEffect(() => {
    const loadProducts = async () => {
      try {
        await showProgressNotification(
          'products_load_init',
          'orders:notifications.loadingProducts',
          () => fetchProducts()
        );
      } 
      catch (error) {
        console.error('Error loading products:', error);
      }
    };

    loadProducts();
  }, []);
}
