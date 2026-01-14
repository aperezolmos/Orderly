import { useEffect } from 'react';
import { Table, Group, Text, Button, ActionIcon, LoadingOverlay,
         NumberInput, ScrollArea } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '../../../utils/formatters';
import { useOrderDashboardStore } from '../store/orderDashboardStore';
import OrderStatusButton from './elements/OrderStatusButton';


const OrderDetailsTable = ({ viewOnly = false }) => {
  
  const {
    currentOrder,
    editedQuantities,
    setItemQuantity,
    isLoadingOrderDetails,
    isUpdatingStatus,
    updateOrderStatus,
    removeOrderItem,
    updateOrder,
  } = useOrderDashboardStore();

  const { t } = useTranslation(['common', 'orders']);


  // Reset edition when current order changes
  useEffect(() => {
    if (currentOrder?.id) {
      setItemQuantity({});
    }
  }, [currentOrder?.id, setItemQuantity]);

  if (!currentOrder) {
    return (
      <Group justify="center" p="md">
        <Text c="dimmed">{t('orders:dashboard.noPendingOrders')}</Text>
      </Group>
    );
  }
  

  const items = Array.isArray(currentOrder?.items) ? currentOrder.items : [];

  // Change the quantity locally (in the store)
  const handleQuantityChange = (itemId, value) => {
    if (!viewOnly) setItemQuantity(itemId, value);
  };

  // Save changes (full update)
  const handleSave = () => {
    if (!viewOnly) updateOrder({ ...currentOrder, items });
  };

  const handleChangeStatus = async (newStatus) => {
    if (!viewOnly) await updateOrderStatus(newStatus);
  };


  return (
    <div className="order-details" style={{ position: 'relative' }}>
      <LoadingOverlay visible={isLoadingOrderDetails} />

      <Group justify="space-between" mb="md" align="center">
        <div>
          <Text fw={500}>
            {t('orders:list.orderNumber') + ' #' + currentOrder.orderNumber}
          </Text>
          <Text size="sm" c="dimmed">
            {currentOrder.customerName || t('orders:list.customerName')}
          </Text>
        </div>
        <OrderStatusButton
          currentStatus={currentOrder.status}
          onChange={handleChangeStatus}
          disabled={isUpdatingStatus || viewOnly}
        />
      </Group>
      
      <ScrollArea h={260} type="auto">
        <Table.ScrollContainer minWidth={500}>
          <Table verticalSpacing="sm" striped>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>{t('orders:dashboard.addProduct')}</Table.Th>
                <Table.Th>{t('products:form.price')}</Table.Th>
                <Table.Th>{t('orders:list.itemCount')}</Table.Th>
                <Table.Th>{t('orders:dashboard.total', { amount: '' })}</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {items.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={4}>
                    <Text c="dimmed" ta="center">
                      {t('orders:dashboard.noProducts')}
                    </Text>
                  </Table.Td>
                </Table.Tr>
              ) : (
                items.map((item) => (
                  <Table.Tr key={item.id}>
                    <Table.Td>{item.productName}</Table.Td>
                    <Table.Td>{formatCurrency(item.unitPrice)}</Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        {!viewOnly && (
                          <ActionIcon
                            size="sm"
                            variant="subtle"
                            color="red"
                            onClick={() => removeOrderItem(item.id)}
                          >
                            <IconTrash size={14} />
                          </ActionIcon>
                        )}
                        <NumberInput
                          size="xs"
                          min={1}
                          value={editedQuantities[item.id] ?? item.quantity}
                          onChange={(value) => handleQuantityChange(item.id, value)}
                          style={{ width: 60 }}
                          disabled={viewOnly}
                        />
                      </Group>
                    </Table.Td>
                    <Table.Td>{formatCurrency(item.totalPrice)}</Table.Td>
                  </Table.Tr>
                ))
              )}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </ScrollArea>
      
      <Group justify="space-between" mt="xl">
        <div style={{ maxWidth: '60%' }}>
          <Text size="sm" c="dimmed">{t('orders:dashboard.notes')}</Text>
          <Text style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {currentOrder.notes || t('orders:dashboard.noNotes')}
          </Text>
        </div>

        <div style={{ textAlign: 'right' }}>
          <Text size="lg" fw={700}>
            {t('orders:dashboard.total', { amount: formatCurrency(currentOrder.totalAmount) })}
          </Text>
          {!viewOnly && (
            <Group justify="flex-end" mt="md">
              <Button variant="outline" onClick={handleSave} loading={isLoadingOrderDetails}>
                {t('common:app.save')}
              </Button>
            </Group>
          )}
        </div>
      </Group>
    </div>
  );
};

export default OrderDetailsTable;
