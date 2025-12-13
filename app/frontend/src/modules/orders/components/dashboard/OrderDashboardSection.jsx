import { useEffect, useState } from 'react';
import { Group, Button, Loader, Paper, Title, Space, ActionIcon, Modal, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { IconPencil, IconTrash } from '@tabler/icons-react';
import { useOrderDashboardStore } from '../../store/orderDashboardStore';
import OrderDetailsTable from './OrderDetailsTable';
import PendingOrdersList from './PendingOrdersList';
import OrderForm from './OrderForm';


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
    deleteOrder,
  } = useOrderDashboardStore();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);


  useEffect(() => {
    fetchOrders(orderType);
  }, [orderType]);


  // Crear pedido
  const openCreateOrderModal = () => {
    modals.open({
      title: `Crear pedido de ${orderType === 'bar' ? 'Barra' : 'Comedor'}`,
      size: 'lg',
      children: (
        <OrderForm
          orderType={orderType}
          onSubmit={async (dto) => {
            setFormLoading(true);
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
            finally {
              setFormLoading(false);
            }
          }}
          onCancel={() => modals.closeAll()}
          loading={formLoading}
          submitLabel="Crear pedido"
        />
      ),
      closeOnClickOutside: false,
      withCloseButton: true,
    });
  };

  // Editar pedido actual
  const openEditOrderModal = () => {
    if (!currentOrder) return;
    modals.open({
      title: `Editar pedido #${currentOrder.orderNumber || currentOrder.id}`,
      size: 'lg',
      children: (
        <OrderForm
          orderType={orderType}
          initialValues={currentOrder}
          onSubmit={async (dto) => {
            setFormLoading(true);
            try {
              await updateOrder({ ...currentOrder, ...dto });
              modals.closeAll();
              notifications.show({
                title: 'Pedido actualizado',
                message: 'El pedido se ha actualizado correctamente',
                color: 'green',
              });
            } 
            catch (err) {
              console.error('Error:', err);
            } 
            finally {
              setFormLoading(false);
            }
          }}
          onCancel={() => modals.closeAll()}
          loading={formLoading}
          submitLabel="Actualizar pedido"
        />
      ),
      closeOnClickOutside: false,
      withCloseButton: true,
    });
  };

  // Eliminar pedido actual
  const handleDeleteOrder = async () => {
    if (!currentOrder) return;
    setFormLoading(true);
    try {
      await deleteOrder(currentOrder.id, orderType);
      setDeleteModalOpen(false);
      notifications.show({
        title: 'Pedido eliminado',
        message: 'El pedido ha sido eliminado correctamente',
        color: 'green',
      });
    } 
    catch (err) {
      notifications.show({
        title: 'Error al eliminar',
        message: err.message,
        color: 'red',
      });
    } 
    finally {
      setFormLoading(false);
    }
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
      {/* Botones de alternar tipo y crear */}
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

      {/* Botones de editar y borrar */}
      <Group mb="md" gap="xs" justify="flex-end">
        <ActionIcon
          variant="subtle"
          color="blue"
          size="lg"
          onClick={openEditOrderModal}
          disabled={!currentOrder}
          title="Editar pedido"
        >
          <IconPencil size={20} />
        </ActionIcon>
        <ActionIcon
          variant="subtle"
          color="red"
          size="lg"
          onClick={() => setDeleteModalOpen(true)}
          disabled={!currentOrder}
          title="Eliminar pedido"
        >
          <IconTrash size={20} />
        </ActionIcon>
      </Group>

      {/* Modal de confirmación de borrado */}
      <Modal
        opened={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Eliminar pedido"
        centered
        size="sm"
      >
        <Text mb="md">
          ¿Seguro que quieres eliminar el pedido{' '}
          <b>#{currentOrder?.orderNumber || currentOrder?.id}</b>? Esta acción no se puede deshacer.
        </Text>
        <Group position="right">
          <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
            Cancelar
          </Button>
          <Button color="red" onClick={handleDeleteOrder} loading={formLoading}>
            Eliminar
          </Button>
        </Group>
      </Modal>

      {/* Tabla de detalles */}
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
