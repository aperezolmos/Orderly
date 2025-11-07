import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Text, Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import FormLayout from '../../../common/layouts/FormLayout';
import UserForm from '../components/UserForm';
import { userService } from '../../../services/backend/userService';


const UserEditPage = () => {
  
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);


  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        setError(null);
        const userData = await userService.getUserById(parseInt(id));
        setUser(userData);
      } 
      catch (err) {
        setError(err.message);
        console.error('Error loading user:', err);
      } 
      finally {
        setLoading(false);
      }
    };

    if (id) {
      loadUser();
    }
  }, [id]);

  const handleSubmit = async (userData) => {
    try {
      setSubmitting(true);
      setError(null);
      
      await userService.updateUser(parseInt(id), userData);
      
      navigate('/users', { replace: true });
    } 
    catch (err) {
      setError(err.message);
      throw err;
    } 
    finally {
      setSubmitting(false);
    }
  };

  const breadcrumbs = [
    { title: 'Users', href: '/users' },
    { title: `Edit User #${id}`, href: `/users/${id}/edit` }
  ];

  if (error && !loading) {
    return (
      <FormLayout
        title="Edit User"
        breadcrumbs={breadcrumbs}
        showBackButton={true}
        error={error}
        onClearError={() => setError(null)}
      >
        <Alert 
          icon={<IconAlertCircle size="1rem" />} 
          title="Error loading user" 
          color="red"
        >
          <Text mb="md">Could not load user with ID: {id}</Text>
          <Text size="sm" color="dimmed">
            The user may have been deleted or you may not have permission to access it.
          </Text>
        </Alert>
      </FormLayout>
    );
  }


  return (
    <FormLayout
      title={`Edit User #${id}`}
      breadcrumbs={breadcrumbs}
      showBackButton={true}
      loading={loading}
      error={error}
      onClearError={() => setError(null)}
    >
      <UserForm
        user={user}
        onSubmit={handleSubmit}
        loading={submitting}
        submitLabel="Update User"
        showRoleManagement={true}
      />
    </FormLayout>
  );
};

export default UserEditPage;
