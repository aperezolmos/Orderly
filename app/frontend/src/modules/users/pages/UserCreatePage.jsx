import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import FormLayout from '../../../common/layouts/FormLayout';
import UserForm from '../components/UserForm';
import { PERMISSIONS } from '../../../utils/permissions';
import { useAuth } from '../../../context/AuthContext';
import { useUsers } from '../hooks/useUsers';
import { getNavigationConfig } from '../../../utils/navigationConfig';


const UserCreatePage = () => {
  
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  const { createUser, loading, error, clearError } = useUsers();
  const { t } = useTranslation(['common', 'users']);


  const handleSubmit = async (userData) => {
    await createUser(userData);
    navigate('/users', { replace: true });
  };
  

  const moduleConfig = getNavigationConfig(t).find(m => m.id === 'users');

  const breadcrumbs = [
    { title: t('users:management.list'), href: '/users' },
    { title: t('users:management.create'), href: '/users/new' }
  ];


  return (
    <FormLayout
      title={t('users:management.create')}
      icon={moduleConfig?.icon}
      iconColor={moduleConfig?.color}
      breadcrumbs={breadcrumbs}
      showBackButton={true}
      loading={loading}
      error={error}
      onClearError={clearError}
    >
      <UserForm
        onSubmit={handleSubmit}
        loading={loading}
        submitLabel={t('users:form.create')}
        showRoleManagement={hasPermission(PERMISSIONS.USER_EDIT_ROLES)}
      />
    </FormLayout>
  );
};

export default UserCreatePage;
