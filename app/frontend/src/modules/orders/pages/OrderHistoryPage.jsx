import { useCallback, useState, useMemo } from 'react';
import { Button, Group, Title, Container, Modal, 
         Loader, Center, Box, Badge, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { IconShoppingCartSearch, IconUser } from '@tabler/icons-react';
import ManagementLayout from '../../../common/layouts/ManagementLayout';
import DataTable from '../../../common/components/DataTable';
import { usePagination, DEFAULT_PAGE_SIZE } from '../../../common/hooks/usePagination';
import OrderDetailsTable from '../components/OrderDetailsTable';
import { useOrderHistory, ORDER_HISTORY_VIEW } from '../hooks/useOrderHistory';
import { getNavigationConfig } from '../../../utils/navigationConfig';
import { getStatusColor } from '../../../utils/statuses';


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
    refetch,
    selectedOrder,
    loadingDetails,
    fetchOrderDetails,
  } = useOrderHistory();
  const [modalOpen, setModalOpen] = useState(false);
  const pagination = usePagination(orders, DEFAULT_PAGE_SIZE);
  const { t } = useTranslation(['orders', 'common']);
  

  const handleOrderNumberClick = useCallback((order) => {
    setModalOpen(true);
    fetchOrderDetails(order);
  }, [fetchOrderDetails]);


  const moduleConfig = getNavigationConfig(t).find(m => m.id === 'orders');
  
  const columns = useMemo(() => [
    {
      key: 'orderNumber',
      title: t('orders:list.orderNumber'),
      render: (order) => (
        <Button
          variant="transparent"
          color="blue"
          onClick={() => handleOrderNumberClick(order)}
          style={{ padding: 0, fontWeight: 500 }}
          title={t('orders:management.view')}
        >
          #{order.orderNumber}
        </Button>
      )
    },
    {
      key: 'updatedAt',
      title: t('orders:list.updated'),
      render: (order) => order.updatedAt ? new Date(order.updatedAt).toLocaleString() : '-'
    },
    {
      key: 'status',
      title: t('orders:list.status'),
      render: (order) => (
        <Badge color={getStatusColor(order.status)}>
          {t(`orders:status.${order.status}`, order.status)}
        </Badge>
      )
    },
    {
      key: 'createdBy',
      title: t('orders:list.createdBy'),
      render: (order) => (
        <Group>
          <IconUser size="1rem" />
          <Text>{order.employeeName ? order.employeeName : '-'}</Text>
        </Group>
      )
    },
    {
      key: 'orderType',
      title: t('orders:list.type'),
      render: (order) => t(`orders:types.${(order.orderType || '').toLowerCase()}`, order.orderType)
    },
    {
      key: 'tableName',
      title: t('orders:list.table'),
      render: (order) => order.tableName || (order.tableId ? order.tableId : '-')
    }
  ], [t, handleOrderNumberClick]);


  return (
    <ManagementLayout
      title={t('orders:management.history')}
      icon={IconShoppingCartSearch}
      iconColor={moduleConfig?.color}
      breadcrumbs={[{ title: t('orders:management.history'), href: '/orders/history' }]}
      showBackButton={true}
    >
      <Container size="xl" px={0}>
        <Group mb="md">
          {viewButtons.map(btn => (
            <Button
              key={btn.key}
              color={btn.color}
              variant={view === btn.key ? 'filled' : 'outline'}
              onClick={() => {
                setView(btn.key);
                pagination.setPage(1);
              }}
            >
              {t(
                btn.key === ORDER_HISTORY_VIEW.ALL
                  ? 'common:app.general'
                  : btn.key === ORDER_HISTORY_VIEW.BAR
                  ? 'orders:management.bar'
                  : 'orders:management.dining'
              )}
            </Button>
          ))}
          <Button variant="subtle" onClick={refetch} ml="auto">
            {t('common:app.reload')}
          </Button>
        </Group>

        <DataTable
          columns={columns}
          data={pagination.paginatedData}
          loading={loading}
          actions={false}
          paginationProps={pagination}
        />
      </Container>

      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        title={t('orders:management.orderDetails')}
        size="xl"
        centered
        overlayProps={{ blur: 2 }}
        styles={{
          body: { padding: 30 },
        }}
      >
        <Box mih={400}>
          {loadingDetails ? (
            <Center h={400}><Loader size="xl" /></Center>
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
