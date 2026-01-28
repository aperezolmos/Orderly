import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Group, Text, Modal, Button, Badge, LoadingOverlay } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconDesk } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import ManagementLayout from '../../../common/layouts/ManagementLayout';
import DataTable from '../../../common/components/DataTable';
import { usePagination, DEFAULT_PAGE_SIZE } from '../../../common/hooks/usePagination';
import { useAuth } from '../../../context/AuthContext';
import { PERMISSIONS } from '../../../utils/permissions';
import { useDiningTables } from '../hooks/useDiningTables';
import { getNavigationConfig } from '../../../utils/navigationConfig';


const DiningTableListPage = () => {
  
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  const { tables, loading, deleteTable, loadTables } = useDiningTables();
  const [tableToDelete, setTableToDelete] = useState(null);
  const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);
  const pagination = usePagination(tables, DEFAULT_PAGE_SIZE);
  const { t } = useTranslation(['common', 'diningTables']);


  useEffect(() => {
    loadTables();
  }, [loadTables]);

  const handleEdit = (table) => {
    navigate(`/tables/${table.id}/edit`);
  };

  const handleDelete = (table) => {
    setTableToDelete(table);
    openDeleteModal();
  };

  const confirmDelete = async () => {
    if (tableToDelete) {
      await deleteTable(tableToDelete.id);
      closeDeleteModal();
      setTableToDelete(null);
    }
  };


  const moduleConfig = getNavigationConfig(t).find(m => m.id === 'tables');

  const columns = [
    {
      key: 'id',
      title: t('diningTables:list.id'),
      render: (table) => <Text weight={500}>#{table.id}</Text>
    },
    {
      key: 'name',
      title: t('diningTables:list.name'),
      render: (table) => (
        <Group>
          <IconDesk size="1rem" />
          <Text>{table.name}</Text>
        </Group>
      )
    },
    {
      key: 'capacity',
      title: t('diningTables:list.capacity'),
      render: (table) => (
        <Badge size="sm" variant="light">
          {table.capacity}
        </Badge>
      )
    },
    {
      key: 'locationDescription',
      title: t('diningTables:list.locationDescription'),
      render: (table) => (
        <Text size="sm" color={!table.locationDescription ? "dimmed" : undefined} fs={!table.locationDescription ? "italic" : undefined}>
          {table.locationDescription || t('diningTables:list.noLocation')}
        </Text>
      )
    },
    {
      key: 'isActive',
      title: t('diningTables:list.isActive'),
      render: (table) => (
        <Badge color={table.isActive ? 'green' : 'gray'} variant="light">
          {table.isActive ? t('diningTables:list.active') : t('diningTables:list.inactive')}
        </Badge>
      )
    },
    {
      key: 'createdAt',
      title: t('diningTables:list.created'),
      render: (table) => (
        <Text size="sm">
          {table.createdAt ? new Date(table.createdAt).toLocaleDateString() : 'N/A'}
        </Text>
      )
    }
  ];
  

  return (
    <>
      <ManagementLayout
        title={t('diningTables:management.title')}
        icon={moduleConfig?.icon}
        iconColor={moduleConfig?.color}
        breadcrumbs={[{ title: t('diningTables:management.list'), href: '/tables' }]}
        showCreateButton={true}
        createButtonLabel={t('diningTables:list.newTable')}
        onCreateClick={() => navigate('/tables/new')}
      >
        <div style={{ position: 'relative' }}>
          <LoadingOverlay visible={loading && !deleteModalOpened} overlayblur={2} />
            <DataTable
              columns={columns}
              data={pagination.paginatedData}
              onEdit={handleEdit}
              onDelete={handleDelete}
              canEdit={hasPermission(PERMISSIONS.TABLE_EDIT)}
              canDelete={hasPermission(PERMISSIONS.TABLE_DELETE)}
              loading={loading}
              paginationProps={pagination}
            />
        </div>
      </ManagementLayout>

      <Modal
        opened={deleteModalOpened}
        onClose={closeDeleteModal}
        title={t('common:modal.titleDelete')}
        size="sm"
      >
        <Text mb="md">
          {t('common:modal.messageDelete', { name: tableToDelete?.name })}
        </Text>
        <Group position="right">
          <Button variant="outline" onClick={closeDeleteModal}>
            {t('common:modal.cancel')}
          </Button>
          <Button color="red" onClick={confirmDelete} loading={loading}>
            {t('common:modal.confirm')}
          </Button>
        </Group>
      </Modal>
    </>
  );
};

export default DiningTableListPage;
