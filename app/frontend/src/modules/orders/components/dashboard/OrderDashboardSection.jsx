import { useEffect } from 'react';
import { Group, Button, Loader, Paper, Title, Space } from '@mantine/core';
import { useOrderDashboardStore } from '../../store/orderDashboardStore';
import OrderDetailsTable from './OrderDetailsTable';
import PendingOrdersList from './PendingOrdersList';


const OrderDashboardSection = () => {
  const {
    orderType,
    setOrderType,
    orders,
    currentOrder,
    isLoadingOrders,
    fetchOrders,
    selectOrder,
    removeOrderItem,
    updateOrder,
  } = useOrderDashboardStore();

  useEffect(() => {
    fetchOrders(orderType);
  }, [orderType]);

  if (isLoadingOrders) {
    return (
      <Paper p="xl" withBorder>
        <Group justify="center">
          <Loader />
          <Title order={4}>Cargando pedidos...</Title>
        </Group>
      </Paper>
    );
  }

  return (
    <div>
      <Group mb="md">
        <Button
          variant={orderType === 'bar' ? 'filled' : 'outline'}
          onClick={() => setOrderType('bar')}
        >
          Pedidos de Barra
        </Button>
        <Button
          variant={orderType === 'dining' ? 'filled' : 'outline'}
          onClick={() => setOrderType('dining')}
        >
          Pedidos de Comedor
        </Button>
      </Group>
      <OrderDetailsTable
        order={currentOrder}
        onRemoveItem={removeOrderItem}
        onSave={updateOrder}
      />
      <Space h="md" />
      <PendingOrdersList
        orders={orders}
        currentOrderId={currentOrder?.id}
        onOrderSelect={selectOrder}
      />
    </div>
  );
};

export default OrderDashboardSection;
