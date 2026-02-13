import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Group, Text, Modal, Button, LoadingOverlay, Tooltip } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconShield } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import ManagementLayout from '../../../common/layouts/ManagementLayout';
import DataTable from '../../../common/components/DataTable';
import { usePagination, DEFAULT_PAGE_SIZE } from '../../../common/hooks/usePagination';
import { useAuth } from '../../../context/AuthContext';
import { PERMISSIONS } from '../../../utils/permissions';
import { useRoles } from '../hooks/useRoles';
import { getNavigationConfig } from '../../../utils/navigationConfig';


const RoleListPage = () => {
  
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  const { roles, loading, deleteRole, loadRoles } = useRoles();
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);
  const pagination = usePagination(roles, DEFAULT_PAGE_SIZE);
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


  const moduleConfig = getNavigationConfig(t).find(m => m.id === 'roles');

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
      render: (role) => {
        const hasDescription = !!role.description;
        const displayContent = role.description || t('roles:list.noDescription');

        return (
          <Tooltip 
            label={displayContent} 
            multiline 
            withArrow 
            disabled={!hasDescription}
            styles={{
              tooltip: {
                maxWidth: 450,
                whiteSpace: 'normal',
                wordBreak: 'break-word',
                
              },
            }}
          >
            <Text 
              size="sm" 
              truncate="end" 
              color={hasDescription ? undefined : 'dimmed'}
              style={{ maxWidth: '370px' }}
            >
              {displayContent}
            </Text>
          </Tooltip>
        );
      }
    },
    {
      key: 'userCount',
      title: t('roles:list.users'),
      render: (role) => (
        <Text weight={500} color={role.userCount > 0 ? 'blue' : 'dimmed'}>
          {role.userCount || 0}
        </Text>
      )
    },
    {
      key: 'updatedAt',
      title: t('common:list.updated'),
      render: (role) => (
        <Text size="sm">
          {role.updatedAt ? new Date(role.updatedAt).toLocaleString() : 'N/A'}
        </Text>
      )
    }
  ];


  return (
    <>
      <ManagementLayout
        title={t('roles:management.title')}
        icon={moduleConfig?.icon}
        iconColor={moduleConfig?.color}
        breadcrumbs={[{ title: t('roles:management.list'), href: '/roles' }]}
        showCreateButton={hasPermission(PERMISSIONS.ROLE_CREATE)}
        createButtonLabel={t('roles:list.newRole')}
        onCreateClick={() => navigate('/roles/new')}
      >
        <div style={{ position: 'relative' }}>
          <LoadingOverlay visible={loading && !deleteModalOpened} overlayblur={2} />
          <DataTable
            columns={columns}
            data={pagination.paginatedData}
            onEdit={handleEdit}
            onDelete={handleDelete}
            canEdit={hasPermission(PERMISSIONS.ROLE_EDIT)}
            canDelete={hasPermission(PERMISSIONS.ROLE_DELETE)}
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
