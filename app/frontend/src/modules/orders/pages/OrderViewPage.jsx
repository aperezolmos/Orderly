import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Paper, Group, Title, Badge, Tabs, LoadingOverlay, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import ManagementLayout from '../../../common/layouts/ManagementLayout';
import OrderForm from '../components/OrderForm';
import OrderDetailsTable from '../components/OrderDetailsTable';
import { orderService } from '../../../services/backend/orderService';
import { getStatusColor, getStatusTranslationKey } from '../../../utils/orderStatuses';


const disabledFields = [
  'orderNumber', 'customerName', 'notes', 'drinksOnly', 'tableId'
];

export default function OrderViewPage() {
  
  const { id } = useParams();
  const { t } = useTranslation(['orders', 'common']);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    orderService.getOrderById(id)
      .then(data => { if (mounted) setOrder(data); })
      .catch(err => { if (mounted) setError(err.message); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [id]);

  const breadcrumbs = [
    { title: t('orders:management.list'), href: '/orders/history' },
    { title: t('orders:management.view'), href: `/orders/${id}/view` }
  ];

  if (loading) {
    return (
      <ManagementLayout title={t('orders:management.view')} breadcrumbs={breadcrumbs} showBackButton={true}>
        <LoadingOverlay visible={true} />
      </ManagementLayout>
    );
  }

  if (error || !order) {
    return (
      <ManagementLayout title={t('orders:management.view')} breadcrumbs={breadcrumbs} showBackButton={true}>
        <Text color="red">{t('orders:errors.notFound', { id })}</Text>
      </ManagementLayout>
    );
  }

  return (
    <ManagementLayout
      title={
        <Group gap="sm">
          <Badge color={getStatusColor(order.status)} size="lg">
            {t(getStatusTranslationKey(order.status), order.status)}
          </Badge>
          <Title order={2} style={{ marginBottom: 0 }}>
            #{order.orderNumber}
          </Title>
        </Group>
      }
      breadcrumbs={breadcrumbs}
      showBackButton={true}
    >
      <Paper shadow="xs" p="md" mb="xl" withBorder>
        <Tabs defaultValue="info">
          <Tabs.List>
            <Tabs.Tab value="info">{t('orders:management.view')}</Tabs.Tab>
            <Tabs.Tab value="items">{t('orders:dashboard.orderDetails')}</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="info" pt="xs">
            <OrderForm
              orderType={order.orderType?.toLowerCase() || 'bar'}
              initialValues={order}
              disabledFields={disabledFields}
              onSubmit={() => {}}
              onCancel={() => {}}
              loading={false}
              submitLabel=""
            />
          </Tabs.Panel>
          <Tabs.Panel value="items" pt="xs">
            <OrderDetailsTable
              order={order}
              viewOnly={true}
            />
          </Tabs.Panel>
        </Tabs>
      </Paper>
    </ManagementLayout>
  );
}
