import { useNavigate } from 'react-router-dom';
import FormLayout from '../../../common/layouts/FormLayout';
import RoleForm from '../components/RoleForm';
import { useRoles } from '../hooks/useRoles';
import { useTranslation } from 'react-i18next';


const RoleCreatePage = () => {
  
  const navigate = useNavigate();
  const { createRole, loading } = useRoles();
  const { t } = useTranslation(['common', 'roles']);


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
