import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormLayout from '../../../common/layouts/FormLayout';
import UserForm from '../components/UserForm';
import { useUsers } from '../hooks/useUsers';
import { useTranslation } from 'react-i18next';


const UserCreatePage = () => {
  
  const navigate = useNavigate();
  const { createUser, loading: createLoading } = useUsers();
  const [error, setError] = useState(null);
  const { t } = useTranslation(['common', 'users']);


  const handleSubmit = async (userData) => {
    try {
      setError(null);
      await createUser(userData);
      navigate('/users', { replace: true });
    } 
    catch (err) {
      setError(err.message);
    }
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
      loading={createLoading}
      error={error}
      onClearError={() => setError(null)}
    >
      <UserForm
        onSubmit={handleSubmit}
        loading={createLoading}
        submitLabel={t('users:form.create')}
        showRoleManagement={true}
      />
    </FormLayout>
  );
};

export default UserCreatePage;
