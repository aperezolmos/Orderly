import { useNavigate } from 'react-router-dom';
import FormLayout from '../../../common/layouts/FormLayout';
import UserForm from '../components/UserForm';
import { useUsers } from '../hooks/useUsers';
import { useTranslation } from 'react-i18next';


const UserCreatePage = () => {
  
  const navigate = useNavigate();
  const { createUser, loading, error, clearError } = useUsers();
  const { t } = useTranslation(['common', 'users']);


  const handleSubmit = async (userData) => {
    await createUser(userData);
    navigate('/users', { replace: true });
  };

  const breadcrumbs = [
    { title: t('users:management.list'), href: '/users' },
    { title: t('users:management.create'), href: '/users/new' }
  ];


  return (
    <FormLayout
      title={t('users:management.create')}
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
        showRoleManagement={true}
      />
    </FormLayout>
  );
};

export default UserCreatePage;
