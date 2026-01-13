import { useEffect } from 'react';
import { Table, Group, Text, Button, ActionIcon,
         NumberInput, ScrollArea } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '../../../utils/formatters';
import { useOrderDashboardStore } from '../store/orderDashboardStore';
import OrderStatusButton from './elements/OrderStatusButton';


const OrderDetailsTable = ({ order, onRemoveItem, onSave, viewOnly = false }) => {
  
  const { editedQuantities, setItemQuantity,
          updateOrderStatus, isUpdatingStatus } = useOrderDashboardStore();
  const { t } = useTranslation(['common','orders']);

  
  useEffect(() => {
    // Reset edición cuando cambia el pedido actual
    setItemQuantity({});
  }, [order?.id]);

  if (!order) {
    return (
      <Group justify="center" p="md">
        <Text c="dimmed">{t('orders:dashboard.noPendingOrders')}</Text>
      </Group>
    );
  }

  // Asegura que siempre sea un array
  const items = Array.isArray(order?.items) ? order.items : [];

  // Cambia la cantidad localmente en el store
  const handleQuantityChange = (itemId, value) => {
    if (!viewOnly) setItemQuantity(itemId, value);
  };

  // Guardar cambios (update completo)
  const handleSave = () => {
    if (!viewOnly) onSave({ ...order, items });
  };

  const handleChangeStatus = async (newStatus) => {
    if (!viewOnly) await updateOrderStatus(newStatus);
  };


  return (
    <div className="order-details">
      <Group justify="space-between" mb="md" align="center">
        <div>
          <Text fw={500}>
            {t('orders:list.orderNumber') + ' #' + order.orderNumber}
          </Text>
          <Text size="sm" c="dimmed">
            {order.customerName || t('orders:list.customerName')}
          </Text>
        </div>
        <OrderStatusButton
          currentStatus={order.status}
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
                            onClick={() => onRemoveItem(item.id)}
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
            {order.notes || t('orders:dashboard.noNotes')}
          </Text>
        </div>

        <div style={{ textAlign: 'right' }}>
          <Text size="lg" fw={700}>
            {t('orders:dashboard.total', { amount: formatCurrency(order.totalAmount) })}
          </Text>
          {!viewOnly && (
            <Group justify="flex-end" mt="md">
              <Button variant="outline" onClick={handleSave}>{t('common:app.save')}</Button>
            </Group>
          )}
        </div>
      </Group>
    </div>
  );
};

export default OrderDetailsTable;
