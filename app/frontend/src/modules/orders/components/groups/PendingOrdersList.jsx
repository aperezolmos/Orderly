import { Group, Text, Paper, ScrollArea, Stack, Loader } from '@mantine/core';
import { IconClock } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import PendingOrdersItem from '../elements/PendingOrdersItem';


const PendingOrdersList = ({
  orders,
  currentOrderId,
  onOrderSelect,
  isLoading,
}) => {
  
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


  return (
    <ScrollArea h={350}>
      <Stack gap="xs">
        {orders.map((order) => (
          <PendingOrdersItem
            key={order.id}
            order={order}
            selected={order.id === currentOrderId}
            onClick={() => onOrderSelect(order.id)}
          />
        ))}
      </Stack>
    </ScrollArea>
  );
};

export default PendingOrdersList;
