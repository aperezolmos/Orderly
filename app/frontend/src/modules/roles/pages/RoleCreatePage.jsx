import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import FormLayout from '../../../common/layouts/FormLayout';
import RoleForm from '../components/RoleForm';
import { useRoles } from '../hooks/useRoles';
import { getNavigationConfig } from '../../../utils/navigationConfig';


const RoleCreatePage = () => {
  
  const navigate = useNavigate();
  const { createRole, loading, error, clearError } = useRoles();
  const { t } = useTranslation(['common', 'roles']);


  const handleSubmit = async (roleData) => {
    await createRole(roleData);
    navigate('/roles', { replace: true });
  };
  

  const moduleConfig = getNavigationConfig(t).find(m => m.id === 'roles');

  const breadcrumbs = [
    { title: t('roles:management.list'), href: '/roles' },
    { title: t('roles:management.create'), href: '/roles/new' }
  ];


  return (
    <FormLayout
      title={t('roles:management.create')}
      icon={moduleConfig?.icon}
      iconColor={moduleConfig?.color}
      breadcrumbs={breadcrumbs}
      showBackButton={true}
      loading={loading}
      error={error}
      onClearError={clearError}
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
