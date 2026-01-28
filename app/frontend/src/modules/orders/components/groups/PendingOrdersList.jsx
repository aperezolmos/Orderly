import { Group, Text, Paper, ScrollArea,
         Stack, Loader, Center } from '@mantine/core';
import { IconClock } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import PendingOrdersItem from '../elements/PendingOrdersItem';
import { useOrderDashboardStore } from '../../store/orderDashboardStore';


const PendingOrdersList = () => {
  
  const {
    orders,
    currentOrder,
    isLoadingOrdersList,
    selectOrder,
  } = useOrderDashboardStore();
  const { t } = useTranslation(['orders']);
  

  if (isLoadingOrdersList) {
    return (
      <Paper p="lg" withBorder>
        <Center py="xl">
          <Stack align="center">
            <Loader />
            <Text>{t('orders:dashboard.pendingOrders')}</Text>
          </Stack>
        </Center>
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
      <Stack gap="xs" mb="xs">
        {orders.map((order) => (
          <PendingOrdersItem
            key={order.id}
            order={order}
            selected={order.id === currentOrder?.id}
            onClick={() => selectOrder(order.id)}
          />
        ))}
      </Stack>
    </ScrollArea>
  );
};

export default PendingOrdersList;
