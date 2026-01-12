import { Table, Text, Badge, Loader, Group } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const statusColors = {
  PENDING: 'yellow',
  IN_PROGRESS: 'blue',
  READY: 'teal',
  SERVED: 'green',
  PAID: 'gray',
  CANCELLED: 'red',
};

export default function OrderHistoryTable({ orders, loading }) {
  const { t } = useTranslation(['orders']);
  const navigate = useNavigate();

  if (loading) {
    return (
      <Group justify="center" py="xl">
        <Loader />
        <Text>{t('common:app.loading')}</Text>
      </Group>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <Text align="center" color="dimmed" py="xl">
        {t('orders:list.noData', { defaultValue: t('common:data.noData') })}
      </Text>
    );
  }

  return (
    <Table striped highlightOnHover>
      <thead>
        <tr>
          <th>{t('orders:list.orderNumber')}</th>
          <th>{t('orders:list.created')}</th>
          <th>{t('orders:list.table')}</th>
          <th>{t('orders:list.status')}</th>
          <th>{t('orders:list.type', { defaultValue: t('orders:management.title') })}</th>
        </tr>
      </thead>
      <tbody>
        {orders.map(order => (
          <tr key={order.id}>
            <td>
              <Text
                variant="link"
                style={{ cursor: 'pointer', color: '#228be6', fontWeight: 600 }}
                onClick={() => navigate(`/orders/${order.id}/view`)}
                title={t('orders:list.viewOrder', { defaultValue: 'View order' })}
              >
                #{order.orderNumber}
              </Text>
            </td>
            <td>
              {order.createdAt ? new Date(order.createdAt).toLocaleString() : '-'}
            </td>
            <td>
              {order.tableName || (order.tableId ? order.tableId : '-')}
            </td>
            <td>
              <Badge color={statusColors[order.status] || 'gray'}>
                {t(`orders:status.${order.status}`, order.status)}
              </Badge>
            </td>
            <td>
              {t(`orders:types.${(order.orderType || '').toLowerCase()}`, order.orderType)}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
