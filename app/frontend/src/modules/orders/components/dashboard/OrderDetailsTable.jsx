import { useEffect } from 'react';
import { Table, Badge, Group, Text, Button, ActionIcon, NumberInput, ScrollArea } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { formatCurrency } from '../../../../utils/formatters';
import { useOrderDashboardStore } from '../../store/orderDashboardStore';


const OrderDetailsTable = ({ order, onRemoveItem, onSave }) => {
  const { editedQuantities, setItemQuantity } = useOrderDashboardStore();

  useEffect(() => {
    // Reset edición cuando cambia el pedido actual
    setItemQuantity({});
  }, [order?.id]);

  if (!order) {
    return (
      <Group justify="center" p="md">
        <Text c="dimmed">No hay pedido seleccionado</Text>
      </Group>
    );
  }

  // Asegura que siempre sea un array
  const items = Array.isArray(order?.items) ? order.items : [];

  // Cambia la cantidad localmente en el store
  const handleQuantityChange = (itemId, value) => {
    setItemQuantity(itemId, value);
  };

  // Guardar cambios (update completo)
  const handleSave = () => {
    onSave({ ...order, items });
  };

  const getStatusColor = (status) => {
    const colors = {
      'PENDING': 'yellow',
      'IN_PROGRESS': 'blue',
      'READY': 'green',
      'SERVED': 'teal',
      'PAID': 'gray',
      'CANCELLED': 'red',
    };
    return colors[status?.toUpperCase()] || 'gray';
  };

  return (
    <div className="order-details">
      <Group justify="apart" mb="md">
        <div>
          <Text fw={500}>Pedido #{order.orderNumber}</Text>
          <Text size="sm" c="dimmed">{order.customerName || 'Cliente no especificado'}</Text>
        </div>
        <Badge color={getStatusColor(order.status)} size="lg" variant="filled">
          {order.status}
        </Badge>
      </Group>
      <ScrollArea h={260} type="auto">
        <Table.ScrollContainer minWidth={500}>
          <Table verticalSpacing="sm" striped>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Producto</Table.Th>
                <Table.Th>Precio Unit.</Table.Th>
                <Table.Th>Cantidad</Table.Th>
                <Table.Th>Total</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {items.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={4}>
                    <Text c="dimmed" ta="center">
                      Este pedido no tiene ningún producto.
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
                        <ActionIcon
                          size="sm"
                          variant="subtle"
                          color="red"
                          onClick={() => onRemoveItem(item.id)}
                        >
                          <IconTrash size={14} />
                        </ActionIcon>
                        <NumberInput
                          size="xs"
                          min={1}
                          value={editedQuantities[item.id] ?? item.quantity}
                          onChange={(value) => handleQuantityChange(item.id, value)}
                          style={{ width: 60 }}
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
          <Text size="sm" c="dimmed">Notas:</Text>
          <Text style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {order.notes || 'Sin notas'}
          </Text>
        </div>

        <div style={{ textAlign: 'right' }}>
          <Text size="lg" fw={700}>
            Total: {formatCurrency(order.totalAmount)}
          </Text>
          <Group justify="flex-end" mt="md">
            <Button variant="outline" onClick={handleSave}>Guardar</Button>
          </Group>
        </div>
      </Group>
    </div>
  );
};

export default OrderDetailsTable;
