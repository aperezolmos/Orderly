import { Table, ActionIcon, Group, Text, Pagination, Select, Stack } from '@mantine/core';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { PAGE_SIZE_OPTIONS } from '../hooks/usePagination';


const DataTable = ({
  columns,
  data,
  onEdit,
  onDelete,
  canEdit = true,
  canDelete = true,
  actions = true,
  loading = false,
  paginationProps
}) => {
  
  const { t } = useTranslation(['common']);


  const selectData = PAGE_SIZE_OPTIONS.map(size => ({
    value: size.toString(),
    label: size.toString()
  }));

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
            <ActionIcon color="blue" onClick={() => onEdit(item)} disabled={loading || !canEdit}>
              <IconEdit size="1rem" />
            </ActionIcon>
            <ActionIcon color="red" onClick={() => onDelete(item)} disabled={loading || !canDelete}>
              <IconTrash size="1rem" />
            </ActionIcon>
          </Group>
        </td>
      )}
    </tr>
  ));

  
  return (
    <Stack spacing="md">

      {paginationProps && (
        <Group gap="xs" align="center" justify="flex-end" mb="md">
          <Text size="xs" c="dimmed" fs="italic">{t('common:data.pagination.showing')}</Text>
          <Select
            size="xs"
            data={selectData}
            value={paginationProps.pageSize.toString()}
            onChange={(val) => paginationProps.setPageSize(Number(val))}
            styles={{
              input: { width: '60px', textAlign: 'center' }
            }}
          />
          <Text size="xs" c="dimmed" fs="italic">{t('common:data.pagination.perPage')}</Text>
        </Group>
      )}
      
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
                <Text align="center" color="dimmed" py="xl">{t('common:app.noData')}</Text>
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {paginationProps && (
        <Stack align="center" mt="xl">
          <Pagination 
            total={paginationProps.totalPages} 
            value={paginationProps.activePage} 
            onChange={paginationProps.setPage} 
            size="sm"
            radius="md"
            withEdges
          />
          <Text size="xs" color="dimmed" mt={4}>
            {t('common:data.pagination.footer', {
              page: paginationProps.activePage,
              totalPages: paginationProps.totalPages,
              count: paginationProps.totalItems
            })}
          </Text>
        </Stack>
      )}
    </Stack>
  );
};

export default DataTable;
