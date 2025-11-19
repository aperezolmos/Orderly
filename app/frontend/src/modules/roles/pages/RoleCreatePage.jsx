import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, LoadingOverlay } from '@mantine/core';
import FormLayout from '../../../common/layouts/FormLayout';
import RoleForm from '../components/RoleForm';
import { useRoles } from '../hooks/useRoles';
import { useTranslationWithLoading } from '../../../common/hooks/useTranslationWithLoading';


const RoleCreatePage = () => {
  
  const navigate = useNavigate();
  const { createRole, loading } = useRoles();
  const { t, ready, isNamespaceLoading } = useTranslationWithLoading(['common', 'roles']);

  
  if (!ready || isNamespaceLoading) {
    return (
      <FormLayout
        title={t('common:app.loading')}
        breadcrumbs={[]}
        showBackButton={true}
      >
        <Box style={{ height: '200px', position: 'relative' }}>
          <LoadingOverlay visible={true} />
        </Box>
      </FormLayout>
    );
  }

  const handleSubmit = async (roleData) => {
    await createRole(roleData);
    navigate('/roles', { replace: true });
  };

  const breadcrumbs = [
    { title: t('roles:management.list'), href: '/roles' },
    { title: t('roles:management.create'), href: '/roles/new' }
  ];


  return (
    <FormLayout
      title={t('roles:management.create')}
      breadcrumbs={breadcrumbs}
      showBackButton={true}
      loading={loading}
    >
      <RoleForm
        onSubmit={handleSubmit}
        loading={loading}
        submitLabel={t('roles:form.create')}
      />
    </FormLayout>
  );
};

export default RoleCreatePage;
