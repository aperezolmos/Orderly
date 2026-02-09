import { useState, useEffect, useCallback } from 'react';
import { notifications } from '@mantine/notifications';
import { useTranslation } from 'react-i18next';
import { orderService } from '../../../services/backend/orderService';


export const ORDER_HISTORY_VIEW = {
  ALL: 'all',
  BAR: 'bar',
  DINING: 'dining',
};


export function useOrderHistory() {
  // List states
  const [orders, setOrders] = useState([]);
  const [view, setView] = useState(ORDER_HISTORY_VIEW.ALL);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Detail states (Modal)
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const { t } = useTranslation(['orders', 'common']);


  const fetchOrders = useCallback(async (selectedView = view) => {
    setLoading(true);
    setError(null);
    try {
      let data = [];
      if (selectedView === ORDER_HISTORY_VIEW.ALL) {
        data = await orderService.getAllOrdersHistory();
      } else if (selectedView === ORDER_HISTORY_VIEW.BAR) {
        data = await orderService.getBarOrdersHistory();
      } else if (selectedView === ORDER_HISTORY_VIEW.DINING) {
        data = await orderService.getDiningOrdersHistory();
      }
      setOrders(Array.isArray(data) ? data : []);
    } 
    catch (err) {
      setError(err.message);
      setOrders([]);
      notifications.show({
        title: t('orders:notifications.loadError'),
        message: err.message,
        color: 'red',
      });
    } 
    finally {
      setLoading(false);
    }
  }, [view, t]);


  useEffect(() => {
    fetchOrders(view);
  }, [view, fetchOrders]);

  
  const fetchOrderDetails = useCallback(async (order) => {
    setSelectedOrder(null);
    setLoadingDetails(true);
    try {
      let fullOrder = null;
      const orderType = (order.orderType || '').toLowerCase();
      if (orderType === 'bar') {
        fullOrder = await orderService.getBarOrderById(order.id);
      } else if (orderType === 'dining') {
        fullOrder = await orderService.getDiningOrderById(order.id);
      } else {
        fullOrder = await orderService.getOrderById(order.id);
      }
      setSelectedOrder(fullOrder);
    } 
    catch (err) {
      notifications.show({
        title: t('orders:notifications.loadError'),
        message: err.message,
        color: 'red',
      });
    } 
    finally {
      setLoadingDetails(false);
    }
  }, [t]);


  return {
    orders,
    loading,
    error,
    view,
    setView,
    refetch: () => fetchOrders(view),
    selectedOrder,
    loadingDetails,
    fetchOrderDetails,
  };
}
