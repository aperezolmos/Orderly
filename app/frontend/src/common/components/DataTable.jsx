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
    <Table.Tr key={item.id}>
      {columns.map((column) => (
        <Table.Td key={column.key}>
          {column.render ? column.render(item) : item[column.key]}
        </Table.Td>
      ))}
      {actions && (
        <Table.Td>
          <Group gap="xs" justify="flex-end">
            <ActionIcon 
              variant="subtle" 
              color="blue" 
              onClick={() => onEdit(item)} 
              disabled={loading || !canEdit}
            >
              <IconEdit size="1.2rem" />
            </ActionIcon>
            <ActionIcon 
              variant="subtle" 
              color="red" 
              onClick={() => onDelete(item)} 
              disabled={loading || !canDelete}
            >
              <IconTrash size="1.2rem" />
            </ActionIcon>
          </Group>
        </Table.Td>
      )}
    </Table.Tr>
  ));

  
  return (
    <Stack gap="md">

      {paginationProps && (
        <Group gap="xs" justify="flex-end">
          <Text size="xs" c="dimmed" fs="italic">{t('common:data.pagination.showing')}</Text>
          <Select
            size="xs"
            data={selectData}
            value={paginationProps.pageSize.toString()}
            onChange={(val) => paginationProps.setPageSize(Number(val))}
            styles={{
              input: { width: '60px', textalign: 'center' }
            }}
          />
          <Text size="xs" c="dimmed" fs="italic">{t('common:data.pagination.perPage')}</Text>
        </Group>
      )}
      
      <Table.ScrollContainer minWidth={800}>
        <Table 
          striped 
          highlightOnHover 
          withTableBorder
          horizontalSpacing="sm"
        >
          <Table.Thead>
            <Table.Tr>
              {columns.map((column) => (
                <Table.Th key={column.key}>{column.title}</Table.Th>
              ))}
              {actions && (
                <Table.Th style={{ width: '100px' }}>
                  <Text size="sm" fw={700} ta="right">
                    {t('common:navigation.actions')}
                  </Text>
                </Table.Th>
              )}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rows.length > 0 ? rows : (
              <Table.Tr>
                <Table.Td colSpan={columns.length + (actions ? 1 : 0)}>
                  <Text align="center" c="dimmed" py="xl">{t('common:data.noData')}</Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>

      {paginationProps && (
        <Stack align="center">
          <Pagination 
            total={paginationProps.totalPages} 
            value={paginationProps.activePage} 
            onChange={paginationProps.setPage} 
            size="sm"
            radius="md"
            withEdges
          />
          <Text size="xs" color="dimmed">
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
