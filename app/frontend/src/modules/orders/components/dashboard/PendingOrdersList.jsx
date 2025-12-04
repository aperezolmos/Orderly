import { Group, Text, Badge, Paper, ScrollArea, Stack, Loader } from '@mantine/core';
import { IconClock } from '@tabler/icons-react';

const PendingOrdersList = ({ orders, currentOrderId, onOrderSelect, isLoading }) => {
  
  if (isLoading) {
    return (
      <Paper p="lg" withBorder>
        <Group justify="center">
          <Loader />
          <Text>Cargando pedidos...</Text>
        </Group>
      </Paper>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <Paper p="lg" withBorder>
        <Group justify="center">
          <IconClock size={48} stroke={1} />
          <div>
            <Text ta="center" fw={500}>No hay pedidos pendientes</Text>
            <Text ta="center" size="sm" c="dimmed">Todos los pedidos están completados</Text>
          </div>
        </Group>
      </Paper>
    );
  }

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

  const formatTime = (dateTime) => {
    if (!dateTime) return '';
    const date = new Date(dateTime);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  

  return (
    <ScrollArea h={350}>
      <Stack gap="xs">
        {orders.map((order) => (
          <Paper
            key={order.id}
            p="md"
            withBorder
            style={{
              cursor: 'pointer',
              borderLeft: `4px solid ${order.id === currentOrderId ? '#228be6' : 'transparent'}`,
              backgroundColor: order.id === currentOrderId ? '#f8f9fa' : 'white',
              transition: 'all 0.2s',
            }}
            onClick={() => onOrderSelect(order.id)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateX(2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateX(0)';
            }}
          >
            <Group justify="apart">
              <div style={{ flex: 1 }}>
                <Text fw={500} truncate>Pedido #{order.orderNumber}</Text>
                <Text size="sm" c="dimmed">
                  {order.customerName || 'Sin cliente'} • 
                  {order.tableName && ` Mesa: ${order.tableName}`}
                  {order.drinksOnly !== undefined && ` • ${order.drinksOnly ? 'Solo bebidas' : 'Comida y bebida'}`}
                </Text>
                <Text size="xs" c="dimmed" mt={4}>
                  Creado: {formatTime(order.createdAt)}
                </Text>
              </div>
              <div style={{ textAlign: 'right', minWidth: 120 }}>
                <Badge color={getStatusColor(order.status)} mb={4}>
                  {order.status}
                </Badge>
                <Text fw={700} size="lg">
                  {order.totalAmount ? `€${order.totalAmount.toFixed(2)}` : '€0.00'}
                </Text>
                <Text size="sm" c="dimmed">
                  {order.items?.length || 0} items
                </Text>
              </div>
            </Group>
            {order.notes && (
              <Text size="sm" c="dimmed" mt="xs" truncate>
                📝 {order.notes}
              </Text>
            )}
          </Paper>
        ))}
      </Stack>
    </ScrollArea>
  );
};

export default PendingOrdersList;
