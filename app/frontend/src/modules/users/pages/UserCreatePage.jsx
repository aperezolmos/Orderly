import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormLayout from '../../../common/layouts/FormLayout';
import UserForm from '../components/UserForm';
import { useUsers } from '../hooks/useUsers';


const UserCreatePage = () => {
  const navigate = useNavigate();
  const { createUser, loading: createLoading } = useUsers();
  const [error, setError] = useState(null);


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
    { title: 'Users', href: '/users' },
    { title: 'Create User', href: '/users/new' }
  ];


  return (
    <FormLayout
      title="Create New User"
      breadcrumbs={breadcrumbs}
      showBackButton={true}
      loading={createLoading}
      error={error}
      onClearError={() => setError(null)}
    >
      <UserForm
        onSubmit={handleSubmit}
        loading={createLoading}
        submitLabel="Create User"
        showRoleManagement={true}
      />
    </FormLayout>
  );
};

export default UserCreatePage;
