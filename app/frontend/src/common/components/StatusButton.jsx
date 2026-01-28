import { Button, Menu } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { getStatuses, getStatusColor,
         getStatusTranslationKey } from '../../utils/statuses';


const StatusButton = ({
  module, // 'orders' | 'reservations' | 'diningTables'
  currentStatus,
  onChange,
  disabled = false,
  size = 'md', // 'sm' | 'md' 
  variant = 'filled',
  statuses, // Optional: list of states to display (by default uses getStatuses(module))
}) => {
  
  const { t } = useTranslation([module, 'common']);


  const statusList = statuses || getStatuses(module);

  const menuItems = statusList.map((status) => ({
    status,
    color: getStatusColor(status),
    translationKey: getStatusTranslationKey(module, status),
    isCurrent: currentStatus === status,
  }));


  const buttonStyles = size === 'sm'
    ? {
        fontSize: 12,
        minWidth: 80,
        height: 28,
        padding: '0 10px',
      }
    : {
        fontSize: 15,
        minWidth: 120,
        height: 36,
        padding: '0 16px',
      };


  return (
    <Menu withinPortal position="bottom-end" shadow="md" disabled={disabled}>
      <Menu.Target>
        <Button
          variant={variant}
          color={getStatusColor(currentStatus)}
          radius="xl"
          rightSection={<IconChevronDown size={size === 'sm' ? 12 : 16} />}
          style={{
            textTransform: 'uppercase',
            fontWeight: 600,
            letterSpacing: 0.5,
            justifyContent: 'center',
            ...buttonStyles,
          }}
          size={size}
          disabled={disabled}
        >
          {t(getStatusTranslationKey(module, currentStatus), currentStatus)}
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
              fontSize: size === 'sm' ? 12 : 15,
            }}
          >
            {t(translationKey, status)}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
};

export default StatusButton;
