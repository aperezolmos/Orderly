import { Table, ActionIcon, Group, Text } from '@mantine/core';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';


const DataTable = ({
  columns,
  data,
  onEdit,
  onDelete,
  canEdit = true,
  canDelete = true,
  actions = true,
  loading = false
}) => {
  
  const { t } = useTranslation('common');


  const rows = data.map((item) => (
    <tr key={item.id}>
      {columns.map((column) => (
        <td key={column.key}>
          {column.render ? column.render(item) : item[column.key]}
        </td>
      ))}
      
      {actions && (
        <td>
          <Group spacing="xs" position="right">
            <ActionIcon
              color="blue"
              onClick={() => onEdit(item)}
              disabled={loading || !canEdit}
            >
              <IconEdit size="1rem" />
            </ActionIcon>
            
            <ActionIcon
              color="red"
              onClick={() => onDelete(item)}
              disabled={loading || !canDelete}
            >
              <IconTrash size="1rem" />
            </ActionIcon>
          </Group>
        </td>
      )}
    </tr>
  ));

  
  return (
    <Table striped highlightOnHover>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.key}>{column.title}</th>
          ))}
          {actions && <th style={{ width: '100px' }}>{t('common:navigation.actions')}</th>}
        </tr>
      </thead>
      <tbody>
        {rows.length > 0 ? rows : (
          <tr>
            <td colSpan={columns.length + (actions ? 1 : 0)}>
              <Text align="center" color="dimmed" py="xl">
                {t('common:data.noData')}
              </Text>
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
};

export default DataTable;
