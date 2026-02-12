import { useEffect, useRef, useState } from 'react';
import { notifications } from '@mantine/notifications';
import { useOrderDashboardStore } from '../store/orderDashboardStore';
import { useLoadingNotification } from '../../../common/hooks/useLoadingNotification';
import { useAuth } from '../../../context/AuthContext';
import { PERMISSIONS } from '../../../utils/permissions';


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
  const { hasPermission, loading: authLoading, permissions } = useAuth();
  const [initialized, setInitialized] = useState(false);

  // On first mount decide the initial order type according to user permissions
  // and set flags so loaders don't run before permissions are evaluated
  const initializedRef = useRef(false);
  const canViewOrdersRef = useRef(false);
  const canViewProductsRef = useRef(false);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    const initOrderType = () => {
      const canBar = hasPermission(PERMISSIONS.ORDER_BAR_VIEW);
      const canDining = hasPermission(PERMISSIONS.ORDER_DINING_VIEW);
      const canProducts = hasPermission(PERMISSIONS.PRODUCT_VIEW);

      // console.debug('[useOrderDashboard] init permissions', { canBar, canDining, canProducts });

      canViewOrdersRef.current = canBar || canDining;
      canViewProductsRef.current = canProducts;

      // If user has only dining permission, switch to dining before any fetch
      if (!canBar && canDining) {
        // console.debug('[useOrderDashboard] switching default orderType -> dining');
        useOrderDashboardStore.getState().setOrderType('dining');
      }

      // Mark initialization complete so loader effects can run
      setInitialized(true);
      initializedRef.current = true;
    };

    initOrderType();
    // Run once when authLoading becomes false
  }, [authLoading, permissions]);


  // INIT: Load orders in page set up
  const lastLoadedTypeRef = useRef(orderType);

  useEffect(() => {
    const loadOrders = async () => {
      if (!initialized) return; // wait until permissions checked

      // If user cannot view any orders, skip loading
      if (!canViewOrdersRef.current) return;

      const prevType = lastLoadedTypeRef.current;

      // If we already have a fresh cache for this type and it was the last loaded,
      // avoid triggering network call/notification
      try {
        const cache = useOrderDashboardStore.getState()._ordersCache?.[orderType];
        const now = Date.now();
        if (cache && now - cache.ts < useOrderDashboardStore.getState()._cacheTtl && prevType === orderType) {
          // Nothing to do, keep current
          lastLoadedTypeRef.current = orderType;
          return;
        }

        await showProgressNotification(
          'orders_load_init',
          'orders:notifications.loadingOrders',
          () => fetchOrders(orderType)
        );

        // Successful load: update last loaded
        lastLoadedTypeRef.current = orderType;
      } 
      catch (error) {
        console.error('Error loading orders:', error);
        // Rollback to previously loaded type
        if (prevType && prevType !== orderType) {
          try {
            useOrderDashboardStore.getState().setOrderType(prevType);
          } 
          catch (e) {
            console.error('Error rolling back order type:', e);
          }
        }
        notifications.show({
          title: 'Error',
          message: error?.message || 'Failed loading orders',
          color: 'red',
        });
      }
    };

    loadOrders();
  }, [orderType, initialized]); // Triggers when the order type changes (bar/dining)


  // INIT: Load products in page set up
  useEffect(() => {
    const loadProducts = async () => {
      // wait until permissions checked
      if (!initialized) return;

      // If user cannot view products, skip loading
      if (!canViewProductsRef.current) return;

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
  }, [initialized]);
}
