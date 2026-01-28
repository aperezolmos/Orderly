import { useState } from 'react';
import { Group, Button, Space, ActionIcon, Modal,
         Text, useMantineTheme } from '@mantine/core';
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
    currentOrder,
    isLoadingOrdersList,
    updateOrder,
    createOrder,
    deleteOrder,
  } = useOrderDashboardStore();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const theme = useMantineTheme();
  const { t } = useTranslation(['common', 'orders']);

  
  const getOrderTypeIcon = (type) => {
    if (type === 'bar') {
      return <IconGlass size={28} color={theme.colors.teal[6]} style={{ marginRight: 10 }} />;
    } 
    else if (type === 'dining') {
      return <IconToolsKitchen2 size={28} color={theme.colors.orange[6]} style={{ marginRight: 10 }} />;
    }
    return null;
  };


  // Create order
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

  // Edit current order
  const openEditOrderModal = () => {
    if (!currentOrder) return;

    modals.open({
      title: (
        <Group align="center" gap="xs">
          {getOrderTypeIcon(orderType)}
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

  // Delete current order
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


  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      {/* Toggle order type and create buttons */}
      <Group mb="md">
        <Button
          variant={orderType === 'bar' ? 'filled' : 'outline'}
          onClick={() => setOrderType('bar')}
          leftSection={<IconGlass size={15} />}
          color="teal"
          disabled={isLoadingOrdersList}
        >
          {t('orders:types.bar')}
        </Button>
        <Button
          variant={orderType === 'dining' ? 'filled' : 'outline'}
          onClick={() => setOrderType('dining')}
          leftSection={<IconToolsKitchen2 size={15} />}
          color="orange"
          disabled={isLoadingOrdersList}
        >
          {t('orders:types.dining')}
        </Button>
        <Button
          variant="light"
          color="green"
          leftSection="+"
          onClick={openCreateOrderModal}
          style={{ marginLeft: 'auto' }}
          disabled={isLoadingOrdersList}
        >
          {t('orders:form.create')}
        </Button>
      </Group>

      {/* Edit and delete buttons */}
      <Group mb="md" gap="xs" justify="flex-end">
        <ActionIcon
          variant="subtle"
          color="blue"
          size="lg"
          onClick={openEditOrderModal}
          disabled={!currentOrder || isLoadingOrdersList}
          title={t('orders:form.edit')}
        >
          <IconPencil size={20} />
        </ActionIcon>
        <ActionIcon
          variant="subtle"
          color="red"
          size="lg"
          onClick={() => setDeleteModalOpen(true)}
          disabled={!currentOrder || isLoadingOrdersList}
          title={t('orders:dashboard.deleteOrder')}
        >
          <IconTrash size={20} />
        </ActionIcon>
      </Group>

      {/* Confirm deletion modal */}
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

      <OrderDetailsTable viewOnly={false} />
      <Space h="md" />
      <PendingOrdersList />
    </div>
  );
};

export default OrderDashboardSection;
