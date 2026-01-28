import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Group, Text, Modal, Button, Badge, LoadingOverlay } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconUser } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import ManagementLayout from '../../../common/layouts/ManagementLayout';
import DataTable from '../../../common/components/DataTable';
import { usePagination, DEFAULT_PAGE_SIZE } from '../../../common/hooks/usePagination';
import { useAuth } from '../../../context/AuthContext';
import { PERMISSIONS } from '../../../utils/permissions';
import { useUsers } from '../hooks/useUsers';
import { getNavigationConfig } from '../../../utils/navigationConfig';


const UserListPage = () => {
  
  const navigate = useNavigate();
  const { user: authUser, hasPermission } = useAuth();
  const { users, loading, deleteUser, loadUsers } = useUsers();
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);
  const pagination = usePagination(users, DEFAULT_PAGE_SIZE);
  const { t } = useTranslation(['common', 'users']);
  

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleEdit = (user) => {
    if (authUser && user.id === authUser.id) {
      navigate('/profile/edit');
    } else {
      navigate(`/users/${user.id}/edit`);
    }
  };

  const handleDelete = (user) => {
    setUserToDelete(user);
    openDeleteModal();
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      await deleteUser(userToDelete.id);
      closeDeleteModal();
      setUserToDelete(null);
    }
  };


  const moduleConfig = getNavigationConfig(t).find(m => m.id === 'users');

  const columns = [
    {
      key: 'id',
      title: t('users:list.id'),
      render: (user) => <Text weight={500}>#{user.id}</Text>
    },
    {
      key: 'username',
      title: t('users:list.username'),
      render: (user) => (
        <Group>
          <IconUser size="1rem" />
          <Text>{user.username}</Text>
        </Group>
      )
    },
    {
      key: 'name',
      title: t('users:list.fullName'),
      render: (user) => {
        const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ');
        return (
          <Text color={!fullName ? "dimmed" : undefined} fs={!fullName ? "italic" : undefined}>
            {fullName || t('users:list.notSpecified')}
          </Text>
        );
      }
    },
    {
      key: 'roles',
      title: t('users:list.roles'),
      render: (user) => (
        <Group spacing="xs">
          {user.roleNames && user.roleNames.length > 0 ? (
            user.roleNames.map((roleName, index) => (
              <Badge key={index} size="sm" variant="light">
                {roleName}
              </Badge>
            ))
          ) : (
            <Text size="sm" color="dimmed" fs="italic">
              {t('users:list.noRoles')}
            </Text>
          )}
        </Group>
      )
    },
    {
      key: 'createdAt',
      title: t('users:list.created'),
      render: (user) => (
        <Text size="sm">
          {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
        </Text>
      )
    }
  ];


  return (
    <>
      <ManagementLayout
        title={t('users:management.title')}
        icon={moduleConfig?.icon}
        iconColor={moduleConfig?.color}
        breadcrumbs={[{ title: t('users:management.list'), href: '/users' }]}
        showCreateButton={true}
        createButtonLabel={t('users:list.newUser')}
        onCreateClick={() => navigate('/users/new')}
      >
        <div style={{ position: 'relative' }}>
          <LoadingOverlay visible={loading && !deleteModalOpened} overlayblur={2} />
            <DataTable
              columns={columns}
              data={pagination.paginatedData}
              onEdit={handleEdit}
              onDelete={handleDelete}
              canEdit={hasPermission(PERMISSIONS.USER_EDIT_OTHERS)}
              canDelete={hasPermission(PERMISSIONS.USER_DELETE)}
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
          {t('common:modal.messageDelete', { name: userToDelete?.username })}
        </Text>
        
        {userToDelete?.roleNames?.includes('ROLE_ADMIN') && (
          <Text size="sm" color="red" mb="md">
            {t('users:deleteModal.adminWarning')}
          </Text>
        )}
        
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

export default UserListPage;
