import { Button, Menu } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { ORDER_STATUSES, getStatusColor,
         getStatusTranslationKey } from '../../../../utils/orderStatuses';


const OrderStatusButton = ({ 
  currentStatus, 
  onChange, 
  disabled = false,
  size = 'md',
  variant = 'light'
}) => {
  
  const { t } = useTranslation(['orders']);

  
  const menuItems = ORDER_STATUSES.map((status) => ({
    status,
    color: getStatusColor(status),
    translationKey: getStatusTranslationKey(status),
    isCurrent: currentStatus === status,
  }));


  return (
    <Menu withinPortal position="bottom-end" shadow="md" disabled={disabled}>
      <Menu.Target>
        <Button
          variant={variant}
          color={getStatusColor(currentStatus)}
          radius="xl"
          rightSection={<IconChevronDown size={16} />}
          style={{
            textTransform: 'uppercase',
            fontWeight: 600,
            letterSpacing: 0.5,
            minWidth: 120,
            justifyContent: 'center',
          }}
          size={size}
          disabled={disabled}
        >
          {t(getStatusTranslationKey(currentStatus), currentStatus)}
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        {menuItems.map(({ status, color, translationKey, isCurrent }) => (
          <Menu.Item
            key={status}
            color={color}
            onClick={() => onChange(status)}
            disabled={isCurrent}
            style={{
              fontWeight: isCurrent ? 700 : 400,
              textTransform: 'uppercase',
            }}
          >
            {t(translationKey, status)}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
};

export default OrderStatusButton;
