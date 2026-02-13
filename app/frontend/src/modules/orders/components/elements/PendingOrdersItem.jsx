import { Group, Text, Badge, Paper,
        useMantineTheme, useMantineColorScheme } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { getStatusColor } from '../../../../utils/statuses';
import { formatTime } from '../../../../utils/formatters';


const PendingOrdersItem = ({
  order,
  selected = false,
  onClick,
}) => {
  
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const { t } = useTranslation(['orders']);

  
  const backgroundColor = selected
    ? colorScheme === 'dark'
      ? theme.colors.dark[6]
      : theme.colors.gray[0]
    : colorScheme === 'dark'
      ? theme.colors.dark[7]
      : theme.white;

  const borderLeft = selected
    ? `4px solid ${theme.colors[theme.primaryColor][6]}`
    : undefined;

  const borderStyle = {
    borderLeft,
    backgroundColor,
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: colorScheme === 'dark' 
      ? '1px 3px 3px rgba(0, 0, 0, 0.8)'
      : theme.shadows.sm
  };


  return (
    <Paper
      p="md"
      withBorder
      style={borderStyle}
      onClick={onClick}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateX(2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateX(0)'; }}
      data-selected={selected}
    >
      <Group justify="space-between" wrap="nowrap" align="flex-start">
        <div style={{ flex: 1, minWidth: 0 }}>
          <Text fw={500} truncate>
            {' #' + order.orderNumber}
          </Text>

          <Text size="sm" c="dimmed" truncate>
            {order.customerName || t('orders:list.noCustomerName')}
            {order.tableName && ` • ${t('orders:list.table')}: ${order.tableName}`}
            {order.drinksOnly && ` • ${t('orders:form.drinksOnly')}`}
          </Text>

          <Text size="xs" c="dimmed" mt={4}>
            {t('orders:dashboard.created', { time: formatTime(order.createdAt) })}
          </Text>
        </div>
        
        <div style={{ textAlign: 'right', minWidth: 120, flexShrink: 0 }}>
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
  );
};

export default PendingOrdersItem;
