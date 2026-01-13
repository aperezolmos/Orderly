import { useCallback } from 'react';
import { Button, Group, Pagination, Paper, Title, Space, Container } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import ManagementLayout from '../../../common/layouts/ManagementLayout';
import OrderHistoryTable from '../components/OrderHistoryTable';
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
    //error,
    view,
    setView,
    activePage,
    setActivePage,
    totalPages,
    allOrdersCount,
    PAGE_SIZE,
    refetch,
  } = useOrderHistory();
  const { t } = useTranslation(['orders', 'common']);

  const handleOrderNumberClick = useCallback((order) => {
    // TODO: aquí se puede redirigir o abrir modal en el futuro
    console.log('Order selected:', order.id, order.orderNumber);
  }, []);

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
    </ManagementLayout>
  );
}
