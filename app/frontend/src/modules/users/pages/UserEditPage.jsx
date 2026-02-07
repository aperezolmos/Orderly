import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Text, Alert } from '@mantine/core';
import { IconAlertCircle, IconEdit } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import FormLayout from '../../../common/layouts/FormLayout';
import UserForm from '../components/UserForm';
import { PERMISSIONS } from '../../../utils/permissions';
import { useAuth } from '../../../context/AuthContext';
import { useUsers } from '../hooks/useUsers';
import { getNavigationConfig } from '../../../utils/navigationConfig';


const UserEditPage = () => {
  
  const { id } = useParams();
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  const {
    currentUser,
    loading,
    error,
    updateUser,
    loadUserById,
    clearError,
  } = useUsers();
  const { t } = useTranslation(['common', 'users']);
  

  useEffect(() => {
    if (id) loadUserById(Number.parseInt(id));
  }, [id, loadUserById]);

  const handleSubmit = async (userData) => {
    await updateUser(Number.parseInt(id), userData);
    navigate('/users', { replace: true });
  };


  const moduleConfig = getNavigationConfig(t).find(m => m.id === 'users');

  const breadcrumbs = [
    { title: t('users:management.list'), href: '/users' },
    { title: t('users:management.edit'), href: `/users/${id}/edit` }
  ];


  if (error && !loading) {
    return (
      <FormLayout
        title={t('users:management.edit')}
        icon={IconEdit}
        iconColor={moduleConfig?.color}
        breadcrumbs={breadcrumbs}
        showBackButton={true}
        error={error}
        onClearError={clearError}
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
      icon={IconEdit}
      iconColor={moduleConfig?.color}
      breadcrumbs={breadcrumbs}
      showBackButton={true}
      loading={loading}
      error={error}
      onClearError={clearError}
    >
      <UserForm
        user={currentUser}
        onSubmit={handleSubmit}
        loading={loading}
        submitLabel={t('users:form.update')}
        showRoleManagement={hasPermission(PERMISSIONS.USER_EDIT_ROLES)}
      />
    </FormLayout>
  );
};

export default UserEditPage;
