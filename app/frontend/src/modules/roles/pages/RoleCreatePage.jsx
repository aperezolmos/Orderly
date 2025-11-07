import React from 'react';
import { useNavigate } from 'react-router-dom';
import FormLayout from '../../../common/layouts/FormLayout';
import RoleForm from '../components/RoleForm';
import { useRoles } from '../hooks/useRoles';


const RoleCreatePage = () => {
  
  const navigate = useNavigate();
  const { createRole, loading } = useRoles();


  const handleSubmit = async (roleData) => {
    await createRole(roleData);
    navigate('/roles', { replace: true });
  };

  const breadcrumbs = [
    { title: 'Roles', href: '/roles' },
    { title: 'Create Role', href: '/roles/new' }
  ];


  return (
    <FormLayout
      title="Create New Role"
      breadcrumbs={breadcrumbs}
      showBackButton={true}
      loading={loading}
    >
      <RoleForm
        onSubmit={handleSubmit}
        loading={loading}
        submitLabel="Create Role"
      />
    </FormLayout>
  );
};

export default RoleCreatePage;
