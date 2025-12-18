import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Text, Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import FormLayout from '../../../common/layouts/FormLayout';
import RoleForm from '../components/RoleForm';
import { roleService } from '../../../services/backend/roleService';
import { useRoles } from '../hooks/useRoles';
import { useTranslation } from 'react-i18next';


const RoleEditPage = () => {
  
  const { id } = useParams();
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { updateRole } = useRoles();
  const { t } = useTranslation(['common', 'roles']);

  
  useEffect(() => {
    const loadRole = async () => {
      try {
        setLoading(true);
        setError(null);
        const roleData = await roleService.getRoleById(parseInt(id));
        setRole(roleData);
      } 
      catch (err) {
        setError(err.message);
        console.error('Error loading role:', err); //borrar
      } 
      finally {
        setLoading(false);
      }
    };
    if (id) loadRole();
  }, [id]);

  const handleSubmit = async (roleData) => {
    try {
      setLoading(true);
      setError(null);
      await updateRole(parseInt(id), roleData);
      navigate('/roles', { replace: true });
    } 
    catch (err) {
      setError(err.message);
      console.error('Error updating role:', err); //borrar
      throw err;
    } 
    finally {
      setLoading(false);
    }
  };

  const breadcrumbs = [
    { title: t('roles:management.list'), href: '/roles' },
    { title: t('roles:management.edit'), href: `/roles/${id}/edit` }
  ];


  if (error && !loading) {
    return (
      <FormLayout
        title={t('roles:management.edit')}
        breadcrumbs={breadcrumbs}
        showBackButton={true}
        error={error}
        onClearError={() => setError(null)}
      >
        <Alert 
          icon={<IconAlertCircle size="1rem" />} 
          title={t('roles:errors.loadError')} 
          color="red"
        >
          <Text mb="md">{t('roles:errors.notFound', { id })}</Text>
          <Text size="sm" color="dimmed">
            {t('roles:errors.notFoundDetails')}
          </Text>
        </Alert>
      </FormLayout>
    );
  }


  return (
    <FormLayout
      title={t('roles:management.edit')}
      breadcrumbs={breadcrumbs}
      showBackButton={true}
      loading={loading}
      error={error}
      onClearError={() => setError(null)}
    >
      <RoleForm
        role={role}
        onSubmit={handleSubmit}
        loading={loading}
        submitLabel={t('roles:form.update')}
      />
    </FormLayout>
  );
};

export default RoleEditPage;
