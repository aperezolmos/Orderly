import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Group, Text, Modal, Button, Badge } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus, IconDesk, IconEdit, IconTrash } from '@tabler/icons-react';
import ManagementLayout from '../../../common/layouts/ManagementLayout';
import DataTable from '../../../common/components/DataTable';
import { useDiningTables } from '../hooks/useDiningTables';
import { useTranslation } from 'react-i18next';


const DiningTableListPage = () => {
  
  const navigate = useNavigate();
  const { tables, loading, deleteTable } = useDiningTables();
  const [tableToDelete, setTableToDelete] = useState(null);
  const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);
  const { t } = useTranslation(['common', 'diningTables']);


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
        <Text size="sm">
          {table.locationDescription || <Text color="dimmed" fs="italic">{t('diningTables:list.noLocation')}</Text>}
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
        breadcrumbs={[{ title: t('diningTables:management.list'), href: '/tables' }]}
        showCreateButton={true}
        createButtonLabel={t('diningTables:list.newTable')}
        onCreateClick={() => navigate('/tables/new')}
      >
        <DataTable
          columns={columns}
          data={tables}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
        />
      </ManagementLayout>

      <Modal
        opened={deleteModalOpened}
        onClose={closeDeleteModal}
        title={t('diningTables:deleteModal.title')}
        size="sm"
      >
        <Text mb="md">
          {t('diningTables:deleteModal.message', { name: tableToDelete?.name })}
        </Text>
        <Group position="right">
          <Button variant="outline" onClick={closeDeleteModal}>
            {t('diningTables:deleteModal.cancel')}
          </Button>
          <Button color="red" onClick={confirmDelete} loading={loading}>
            {t('diningTables:deleteModal.confirm')}
          </Button>
        </Group>
      </Modal>
    </>
  );
};

export default DiningTableListPage;
