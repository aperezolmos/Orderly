import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {  Group, Text, Modal, Button, Badge } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus, IconUser, IconEdit, IconTrash } from '@tabler/icons-react';
import ManagementLayout from '../../../common/layouts/ManagementLayout';
import DataTable from '../../../common/components/DataTable';
import { useUsers } from '../hooks/useUsers';


const UserListPage = () => {
  
  const navigate = useNavigate();
  const { users, loading, deleteUser } = useUsers();
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);
  

  const handleEdit = (user) => {
    navigate(`/users/${user.id}/edit`);
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

  const columns = [
    {
      key: 'id',
      title: 'ID',
      render: (user) => <Text weight={500}>#{user.id}</Text>
    },
    {
      key: 'username',
      title: 'Username',
      render: (user) => (
        <Group>
          <IconUser size="1rem" />
          <Text>{user.username}</Text>
        </Group>
      )
    },
    {
      key: 'name',
      title: 'Full Name',
      render: (user) => (
        <Text>
          {[user.firstName, user.lastName].filter(Boolean).join(' ') || 
           <Text color="dimmed" fs="italic">Not specified</Text>}
        </Text>
      )
    },
    {
      key: 'roles',
      title: 'Roles',
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
              No roles
            </Text>
          )}
        </Group>
      )
    },
    {
      key: 'createdAt',
      title: 'Created',
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
        title="User Management"
        breadcrumbs={[{ title: 'Users', href: '/users' }]}
        showCreateButton={true}
        createButtonLabel="New User"
        onCreateClick={() => navigate('/users/new')}
      >
        <DataTable
          columns={columns}
          data={users}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
        />
      </ManagementLayout>

      <Modal
        opened={deleteModalOpened}
        onClose={closeDeleteModal}
        title="Confirm User Deletion"
        size="sm"
      >
        <Text mb="md">
          Are you sure you want to delete user "{userToDelete?.username}"? 
          This action cannot be undone.
        </Text>
        
        {userToDelete?.roleNames?.includes('ROLE_ADMIN') && (
          <Text size="sm" color="red" mb="md">
            Warning: This user has admin privileges.
          </Text>
        )}
        
        <Group position="right">
          <Button variant="outline" onClick={closeDeleteModal}>
            Cancel
          </Button>
          <Button color="red" onClick={confirmDelete} loading={loading}>
            Delete
          </Button>
        </Group>
      </Modal>
    </>
  );
};

export default UserListPage;
