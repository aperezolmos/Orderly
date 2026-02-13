import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IconEdit } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import FormLayout from '../../../common/layouts/FormLayout';
import RoleForm from '../components/RoleForm';
import { useRoles } from '../hooks/useRoles';
import { getNavigationConfig } from '../../../utils/navigationConfig';


const RoleEditPage = () => {
  
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    currentRole,
    loading,
    error,
    updateRole,
    loadRoleById,
    clearError,
  } = useRoles();
  const { t } = useTranslation(['common', 'roles']);

  
  useEffect(() => {
    if (id) loadRoleById(Number.parseInt(id));
  }, [id, loadRoleById]);

  const handleSubmit = async (roleData) => {
    await updateRole(Number.parseInt(id), roleData);
    navigate('/roles', { replace: true });
  };


  const moduleConfig = getNavigationConfig(t).find(m => m.id === 'roles');

  const breadcrumbs = [
    { title: t('roles:management.list'), href: '/roles' },
    { title: t('roles:management.edit'), href: `/roles/${id}/edit` }
  ];


  return (
    <FormLayout
      title={t('roles:management.edit')}
      icon={IconEdit}
      iconColor={moduleConfig?.color}
      breadcrumbs={breadcrumbs}
      showBackButton={true}
      loading={loading}
      error={error}
      onClearError={clearError}
    >
      <RoleForm
        role={currentRole}
        onSubmit={handleSubmit}
        loading={loading}
        submitLabel={t('roles:form.update')}
      />
    </FormLayout>
  );
};

export default RoleEditPage;
