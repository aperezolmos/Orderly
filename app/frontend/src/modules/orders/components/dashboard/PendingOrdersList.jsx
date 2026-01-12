import { Group, Text, Badge, Paper, ScrollArea, Stack, Loader } from '@mantine/core';
import { IconClock } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { getStatusColor } from '../../../../utils/orderStatuses';


const PendingOrdersList = ({ orders, currentOrderId, onOrderSelect, isLoading }) => {
  
  const { t } = useTranslation(['orders']);
  

  if (isLoading) {
    return (
      <Paper p="lg" withBorder>
        <Group justify="center">
          <Loader />
          <Text>{t('orders:dashboard.pendingOrders')}</Text>
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
            <Text ta="center" fw={500}>{t('orders:dashboard.noPendingOrders')}</Text>
            <Text ta="center" size="sm" c="dimmed">{t('orders:dashboard.allCompleted')}</Text>
          </div>
        </Group>
      </Paper>
    );
  }

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
                <Text fw={500} truncate>
                  {t('orders:list.orderNumber') + ' #' + order.orderNumber}
                </Text>
                <Text size="sm" c="dimmed">
                  {order.customerName || t('orders:list.customerName')}
                  {order.tableName && ` • ${t('orders:list.table')}: ${order.tableName}`}
                  {order.drinksOnly !== undefined && ` • ${order.drinksOnly ? t('orders:form.drinksOnly') : t('orders:dashboard.addProduct')}`}
                </Text>
                <Text size="xs" c="dimmed" mt={4}>
                  {t('orders:dashboard.created', { time: formatTime(order.createdAt) })}
                </Text>
              </div>
              <div style={{ textAlign: 'right', minWidth: 120 }}>
                <Badge color={getStatusColor(order.status)} mb={4}>
                  {t(`orders:status.${order.status}`, order.status)}
                </Badge>
                <Text fw={700} size="lg">
                  {order.totalAmount ? `€${order.totalAmount.toFixed(2)}` : '€0.00'}
                </Text>
                <Text size="sm" c="dimmed">
                  {order.itemCount === 1
                    ? `1 ${t('orders:list.itemCount')}`
                    : `${order.itemCount} ${t('orders:list.itemCount')}`}
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
