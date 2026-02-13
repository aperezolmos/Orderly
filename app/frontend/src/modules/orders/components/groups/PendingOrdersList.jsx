import { Group, Text, Paper, ScrollArea,
         Stack, Loader, Center, LoadingOverlay } from '@mantine/core';
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
    <div className="pending-orders-list" style={{ position: 'relative' }}>
      <ScrollArea h={520}>
        <LoadingOverlay 
          visible={isLoadingOrdersList} 
          zIndex={10} 
          overlayProps={{ blur: 1, backgroundOpacity: 0.5 }} 
        />

        <Stack gap="xs" mb="xs" mt="lg">
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
    </div>

    
  );
};

export default PendingOrdersList;
