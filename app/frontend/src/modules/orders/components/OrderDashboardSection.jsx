import { useEffect, useState } from 'react';
import { Group, Button, Loader, Paper, Title, Space,
         ActionIcon, Modal, Text, useMantineTheme } from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { IconPencil, IconTrash, IconGlass, IconToolsKitchen2 } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useOrderDashboardStore } from '../store/orderDashboardStore';
import OrderDetailsTable from './OrderDetailsTable';
import PendingOrdersList from './groups/PendingOrdersList';
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
  const { t } = useTranslation(['common', 'orders']);
  const theme = useMantineTheme();

  
  const getOrderTypeIcon = (type) => {
    if (type === 'bar') {
      return <IconGlass size={28} color={theme.colors.teal[6]} style={{ marginRight: 10 }} />;
    } 
    else if (type === 'dining') {
      return <IconToolsKitchen2 size={28} color={theme.colors.orange[6]} style={{ marginRight: 10 }} />;
    }
    return null;
  };


  useEffect(() => {
    fetchOrders(orderType);
  }, [orderType]);


  // Crear pedido
  const openCreateOrderModal = () => {
    modals.open({
      title: (
        <Group align="center" gap="xs">
          {getOrderTypeIcon(orderType)}
          <span>{t('orders:management.create')} {t(`orders:types.${orderType}`)}</span>
        </Group>
      ),
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
                title: t('common:app.success'),
                message: t('orders:notifications.createSuccess'),
                color: 'green',
              });
            } 
            catch (err) {
              notifications.show({
                title: t('common:app.error'),
                message: err.message,
                color: 'red',
              });
            } 
            finally {
              setFormLoading(false);
            }
          }}
          onCancel={() => modals.closeAll()}
          loading={formLoading}
          submitLabel={t('orders:form.create')}
        />
      ),
      closeOnClickOutside: false,
      withCloseButton: true,
    });
  };

  // Editar pedido actual
  const openEditOrderModal = () => {
    if (!currentOrder) return;
    const orderTypeForIcon = orderType;
    
    modals.open({
      title: (
        <Group align="center" gap="xs">
          {getOrderTypeIcon(orderTypeForIcon)}
          <span>{t('orders:management.edit')} #{currentOrder.orderNumber || currentOrder.id}</span>
        </Group>
      ),
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
                title: t('common:app.success'),
                message: t('orders:notifications.updateSuccess'),
                color: 'green',
              });
            } 
            catch (err) {
              notifications.show({
                title: t('common:app.error'),
                message: err.message,
                color: 'red',
              });
            } 
            finally {
              setFormLoading(false);
            }
          }}
          onCancel={() => modals.closeAll()}
          loading={formLoading}
          submitLabel={t('orders:form.update')}
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
        title: t('common:app.success'),
        message: t('orders:notifications.deleteSuccess'),
        color: 'green',
      });
    } 
    catch (err) {
      notifications.show({
        title: t('orders:notifications.deleteError'),
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
          <Title order={4}>{t('common:app.loading')}</Title>
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
          leftSection={<IconGlass size={15} />}
          color="teal"
        >
          {t('orders:management.bar')}
        </Button>
        <Button
          variant={orderType === 'dining' ? 'filled' : 'outline'}
          onClick={() => setOrderType('dining')}
          leftSection={<IconToolsKitchen2 size={15} />}
          color="orange"
        >
          {t('orders:management.dining')}
        </Button>
        <Button
          variant="light"
          color="green"
          leftSection="+"
          onClick={openCreateOrderModal}
          style={{ marginLeft: 'auto' }}
        >
          {t('orders:form.create')}
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
          title={t('orders:form.edit')}
        >
          <IconPencil size={20} />
        </ActionIcon>
        <ActionIcon
          variant="subtle"
          color="red"
          size="lg"
          onClick={() => setDeleteModalOpen(true)}
          disabled={!currentOrder}
          title={t('orders:dashboard.deleteOrder')}
        >
          <IconTrash size={20} />
        </ActionIcon>
      </Group>

      {/* Modal de confirmación de borrado */}
      <Modal
        opened={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title={t('orders:dashboard.deleteOrder')}
        centered
        size="sm"
      >
        <Text mb="md">
          {t('orders:dashboard.confirmDeleteMessage', {
            order: `#${currentOrder?.orderNumber || currentOrder?.id}`,
          })}
        </Text>
        <Group position="right">
          <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
            {t('common:app.cancel')}
          </Button>
          <Button color="red" onClick={handleDeleteOrder} loading={formLoading}>
            {t('common:app.delete')}
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
