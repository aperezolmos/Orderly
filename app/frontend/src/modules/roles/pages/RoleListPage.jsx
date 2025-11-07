import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Group, Text, Modal,Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus, IconShield } from '@tabler/icons-react';
import ManagementLayout from '../../../common/layouts/ManagementLayout';
import DataTable from '../../../common/components/DataTable';
import { useRoles } from '../hooks/useRoles';


const RoleListPage = () => {
  
  const navigate = useNavigate();
  const { roles, loading, deleteRole } = useRoles();
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);

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
      title: 'ID',
      render: (role) => <Text weight={500}>#{role.id}</Text>
    },
    {
      key: 'name',
      title: 'Name',
      render: (role) => (
        <Group>
          <IconShield size="1rem" />
          <Text>{role.name}</Text>
        </Group>
      )
    },
    {
      key: 'description',
      title: 'Description',
      render: (role) => role.description || <Text color="dimmed">No description</Text>
    },
    {
      key: 'userCount',
      title: 'Users',
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
        title="Role Management"
        breadcrumbs={[{ title: 'Roles', href: '/roles' }]}
        showCreateButton={true}
        createButtonLabel="New Role"
        onCreateClick={() => navigate('/roles/new')}
      >
        <DataTable
          columns={columns}
          data={roles}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
        />
      </ManagementLayout>

      <Modal
        opened={deleteModalOpened}
        onClose={closeDeleteModal}
        title="Confirm Deletion"
        size="sm"
      >
        <Text mb="md">
          Are you sure you want to delete role "{roleToDelete?.name}"? 
          This action cannot be undone.
        </Text>
        
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

export default RoleListPage;
