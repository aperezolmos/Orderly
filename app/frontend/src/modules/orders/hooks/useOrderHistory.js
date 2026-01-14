import { useState, useEffect, useCallback } from 'react';
import { notifications } from '@mantine/notifications';
import { useTranslation } from 'react-i18next';
import { orderService } from '../../../services/backend/orderService';

const PAGE_SIZE = 15;

export const ORDER_HISTORY_VIEW = {
  ALL: 'all',
  BAR: 'bar',
  DINING: 'dining',
};

export function useOrderHistory() {
  const [orders, setOrders] = useState([]);
  const [view, setView] = useState(ORDER_HISTORY_VIEW.ALL);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activePage, setActivePage] = useState(1);
  const { t } = useTranslation(['orders', 'common']);

  const fetchOrders = useCallback(async (selectedView = view) => {
    setLoading(true);
    setError(null);
    try {
      let data = [];
      if (selectedView === ORDER_HISTORY_VIEW.ALL) {
        data = await orderService.getAllOrders();
      } else if (selectedView === ORDER_HISTORY_VIEW.BAR) {
        data = await orderService.getBarOrders();
      } else if (selectedView === ORDER_HISTORY_VIEW.DINING) {
        data = await orderService.getDiningOrders();
      }
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
      setOrders([]);
      notifications.show({
        title: t('orders:notifications.loadError'),
        message: err.message,
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  }, [view, t]);

  useEffect(() => {
    fetchOrders(view);
    setActivePage(1);
  }, [view, fetchOrders]);

  // Paginación manual
  const totalPages = Math.max(1, Math.ceil(orders.length / PAGE_SIZE));
  const paginatedOrders = orders.slice((activePage - 1) * PAGE_SIZE, activePage * PAGE_SIZE);

  return {
    orders: paginatedOrders,
    loading,
    error,
    view,
    setView,
    activePage,
    setActivePage,
    totalPages,
    PAGE_SIZE,
    allOrdersCount: orders.length,
    refetch: () => fetchOrders(view),
  };
}
