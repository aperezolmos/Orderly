import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Group, Text, Modal, Button, LoadingOverlay } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconShield } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import ManagementLayout from '../../../common/layouts/ManagementLayout';
import DataTable from '../../../common/components/DataTable';
import { useRoles } from '../hooks/useRoles';


const RoleListPage = () => {
  
  const navigate = useNavigate();
  const { roles, loading, deleteRole, loadRoles } = useRoles();
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);
  const { t } = useTranslation(['common', 'roles']);


  useEffect(() => {
    loadRoles();
  }, [loadRoles]);

  const handleEdit = (role) => {
    navigate(`/roles/${role.id}/edit`);
  };

  const handleDelete = (role) => {
    setRoleToDelete(role);
    openDeleteModal();
  };

  const confirmDelete = async () => {
    if (roleToDelete) {
      await deleteRole(roleToDelete.id);
      closeDeleteModal();
      setRoleToDelete(null);
    }
  };

  const columns = [
    {
      key: 'id',
      title: t('roles:list.id'),
      render: (role) => <Text weight={500}>#{role.id}</Text>
    },
    {
      key: 'name',
      title: t('roles:list.name'),
      render: (role) => (
        <Group>
          <IconShield size="1rem" />
          <Text>{role.name}</Text>
        </Group>
      )
    },
    {
      key: 'description',
      title: t('roles:list.description'),
      render: (role) => role.description || <Text color="dimmed">{t('roles:list.noDescription')}</Text>
    },
    {
      key: 'userCount',
      title: t('roles:list.users'),
      render: (role) => (
        <Text weight={500} color={role.userCount > 0 ? 'blue' : 'dimmed'}>
          {role.userCount || 0}
        </Text>
      )
    }
  ];


  return (
    <>
      <ManagementLayout
        title={t('roles:management.title')}
        breadcrumbs={[{ title: t('roles:management.list'), href: '/roles' }]}
        showCreateButton={true}
        createButtonLabel={t('roles:list.newRole')}
        onCreateClick={() => navigate('/roles/new')}
      >
        <div style={{ position: 'relative' }}>
          <LoadingOverlay visible={loading && !deleteModalOpened} overlayblur={2} />
          <DataTable
            columns={columns}
            data={roles}
            onEdit={handleEdit}
            onDelete={handleDelete}
            loading={loading}
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
          {t('common:modal.messageDelete', { name: roleToDelete?.name })}
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

export default RoleListPage;
