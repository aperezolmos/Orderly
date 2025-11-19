import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Text, Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import FormLayout from '../../../common/layouts/FormLayout';
import UserForm from '../components/UserForm';
import { userService } from '../../../services/backend/userService';
import { useTranslation } from 'react-i18next';


const UserEditPage = () => {
  
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { t } = useTranslation(['common', 'users']);
  

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
    { title: t('users:management.list'), href: '/users' },
    { title: t('users:management.edit'), href: `/users/${id}/edit` }
  ];

  if (error && !loading) {
    return (
      <FormLayout
        title={t('users:management.edit')}
        breadcrumbs={breadcrumbs}
        showBackButton={true}
        error={error}
        onClearError={() => setError(null)}
      >
        <Alert 
          icon={<IconAlertCircle size="1rem" />} 
          title={t('users:errors.loadError')} 
          color="red"
        >
          <Text mb="md">{t('users:errors.notFound', { id })}</Text>
          <Text size="sm" color="dimmed">
            {t('users:errors.notFoundDetails')}
          </Text>
        </Alert>
      </FormLayout>
    );
  }


  return (
    <FormLayout
      title={t('users:management.edit')}
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
        submitLabel={t('users:form.update')}
        showRoleManagement={true}
      />
    </FormLayout>
  );
};

export default UserEditPage;
