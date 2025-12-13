import { useEffect } from 'react';
import { Group, Button, Loader, Paper, Title, Space } from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { useOrderDashboardStore } from '../../store/orderDashboardStore';
import OrderDetailsTable from './OrderDetailsTable';
import PendingOrdersList from './PendingOrdersList';
import OrderCreateForm from './OrderCreateForm';


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
    createOrder,
  } = useOrderDashboardStore();


  useEffect(() => {
    fetchOrders(orderType);
  }, [orderType]);

  const openCreateOrderModal = () => {
    modals.open({
      title: `Crear pedido de ${orderType === 'bar' ? 'Barra' : 'Comedor'}`,
      size: 'lg',
      children: (
        <OrderCreateForm
          orderType={orderType}
          onSuccess={async (dto) => {
            try {
              await createOrder(dto, orderType);
              modals.closeAll();
              notifications.show({
                title: 'Pedido creado',
                message: 'El pedido se ha creado correctamente',
                color: 'green',
              });
            } 
            catch (err) {
              console.error('Error:', err);
            }
          }}
          onCancel={() => modals.closeAll()}
        />
      ),
      closeOnClickOutside: false,
      withCloseButton: true,
    });
  };

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
        <Button
          variant="light"
          color="green"
          leftSection="+"
          onClick={openCreateOrderModal}
          style={{ marginLeft: 'auto' }}
        >
          Crear pedido
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
