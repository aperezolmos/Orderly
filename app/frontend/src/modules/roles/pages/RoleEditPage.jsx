import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Text, Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import FormLayout from '../../../common/layouts/FormLayout';
import RoleForm from '../components/RoleForm';
import { roleService } from '../../../services/backend/roleService';
import { useRoles } from '../hooks/useRoles';


const RoleEditPage = () => {
  
  const { id } = useParams();
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { updateRole } = useRoles();


  useEffect(() => {
    const loadRole = async () => {
      try {
        setLoading(true);
        setError(null);
        const roleData = await roleService.getRoleById(parseInt(id));
        setRole(roleData);
      } 
      catch (err) {
        setError(err.message);
        console.error('Error loading role:', err);
      } 
      finally {
        setLoading(false);
      }
    };

    if (id) {
      loadRole();
    }
  }, [id]);

  const handleSubmit = async (roleData) => {
    try {
      setLoading(true);
      setError(null);
      
      await updateRole(parseInt(id), roleData);
      navigate('/roles', { replace: true });
    } 
    catch (err) {
      setError(err.message);
      throw err;
    } 
    finally {
      setLoading(false);
    }
  };

  const breadcrumbs = [
    { title: 'Roles', href: '/roles' },
    { title: `Edit Role #${id}`, href: `/roles/${id}/edit` }
  ];


  // Show error if the role cannot be loaded
  if (error && !loading) {
    return (
      <FormLayout
        title="Edit Role"
        breadcrumbs={breadcrumbs}
        showBackButton={true}
        error={error}
        onClearError={() => setError(null)}
      >
        <Alert 
          icon={<IconAlertCircle size="1rem" />} 
          title="Error loading role" 
          color="red"
        >
          <Text mb="md">Could not load role with ID: {id}</Text>
          <Text size="sm" color="dimmed">
            The role may have been deleted or you may not have permission to access it.
          </Text>
        </Alert>
      </FormLayout>
    );
  }


  return (
    <FormLayout
      title={`Edit Role #${id}`}
      breadcrumbs={breadcrumbs}
      showBackButton={true}
      loading={loading}
      error={error}
      onClearError={() => setError(null)}
    >
      <RoleForm
        role={role}
        onSubmit={handleSubmit}
        loading={loading}
        submitLabel="Update Role"
      />
    </FormLayout>
  );
};

export default RoleEditPage;
