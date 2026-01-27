import { useCallback, useState } from 'react';
import { Button, Group, Pagination, Paper, Title, Space,
         Container, Modal, Loader, Center, Box } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import ManagementLayout from '../../../common/layouts/ManagementLayout';
import OrderHistoryTable from '../components/OrderHistoryTable';
import OrderDetailsTable from '../components/OrderDetailsTable';
import { useOrderHistory, ORDER_HISTORY_VIEW } from '../hooks/useOrderHistory';


const viewButtons = [
  { key: ORDER_HISTORY_VIEW.ALL, color: 'blue' },
  { key: ORDER_HISTORY_VIEW.BAR, color: 'teal' },
  { key: ORDER_HISTORY_VIEW.DINING, color: 'orange' },
];

export default function OrderHistoryPage() {
  
  const {
    orders,
    loading,
    view,
    setView,
    activePage,
    setActivePage,
    totalPages,
    allOrdersCount,
    refetch,
    selectedOrder,
    loadingDetails,
    fetchOrderDetails,
  } = useOrderHistory();
  const [modalOpen, setModalOpen] = useState(false);
  const { t } = useTranslation(['orders', 'common']);

  
  const handleOrderNumberClick = useCallback((order) => {
    setModalOpen(true);
    fetchOrderDetails(order);
  }, [fetchOrderDetails]);

  const breadcrumbs = [
    { title: t('orders:management.dashboard'), href: '/orders' },
    { title: t('orders:management.list'), href: '/orders/history' },
  ];


  return (
    <ManagementLayout
      title={t('orders:management.list')}
      breadcrumbs={breadcrumbs}
      showBackButton={true}
    >
      <Container size="lg" px={0}>
        <Group mb="md">
          {viewButtons.map(btn => (
            <Button
              key={btn.key}
              color={btn.color}
              variant={view === btn.key ? 'filled' : 'outline'}
              onClick={() => setView(btn.key)}
            >
              {t(
                btn.key === ORDER_HISTORY_VIEW.ALL
                  ? 'orders:management.list'
                  : btn.key === ORDER_HISTORY_VIEW.BAR
                  ? 'orders:management.bar'
                  : 'orders:management.dining'
              )}
            </Button>
          ))}
          <Button variant="subtle" onClick={refetch} ml="auto">
            {t('common:app.reload', { defaultValue: 'Reload' })}
          </Button>
        </Group>
        <Paper shadow="xs" p="md" withBorder>
          <OrderHistoryTable
            orders={orders}
            loading={loading}
            onOrderNumberClick={handleOrderNumberClick}
          />
          <Space h="md" />
          {totalPages > 1 && (
            <Group justify="center" mt="md">
              <Pagination
                value={activePage}
                onChange={setActivePage}
                total={totalPages}
                withEdges
                size="md"
              />
            </Group>
          )}
          <Group justify="center" mt="xs">
            <span style={{ color: '#888', fontSize: 13 }}>
              {t('orders:dashboard.pageFooter', {
                page: activePage,
                totalPages,
                count: orders.length,
              })}
              {' '}
              • {t('common:data.total', { count: allOrdersCount, defaultValue: `Total: ${allOrdersCount}` })}
            </span>
          </Group>
        </Paper>
      </Container>

      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        title={t('orders:management.orderDetails')}
        size="xl"
        centered
        withCloseButton
        overlayProps={{ blur: 2 }}
        styles={{
          body: { padding: 30 },
        }}
      >
        <Box mih={400}>
          {loadingDetails ? (
            <Center h={400}>
              <Loader size="xl" type="oval" /> 
            </Center>
          ) : selectedOrder ? (
            <OrderDetailsTable
              viewOnly={true}
              order={selectedOrder}
            />
          ) : (
            <Center h={400}>
               <Title order={4} c="red">{t('orders:errors.notFound')}</Title>
            </Center>
          )}
        </Box>
      </Modal>
    </ManagementLayout>
  );
}
