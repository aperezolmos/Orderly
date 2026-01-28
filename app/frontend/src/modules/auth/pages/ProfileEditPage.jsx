import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import FormLayout from '../../../common/layouts/FormLayout';
import UserForm from '../../users/components/UserForm';
import { useAuth } from '../../../context/AuthContext';
import { PERMISSIONS } from '../../../utils/permissions';
import { useUsers } from '../../users/hooks/useUsers';


const ProfileEditPage = () => {
  
  const navigate = useNavigate();
  const { user: authUser, hasPermission, updateUserContext } = useAuth();
  const { updateUser, loading, error, clearError } = useUsers();
  const { t } = useTranslation(['common', 'auth']);
  

  const handleSubmit = async (userData) => {
    const updatedUser = await updateUser(authUser.id, userData);
    
    if (updatedUser) {
      updateUserContext(updatedUser);
      navigate('/profile', { replace: true });
    }
  };

  const breadcrumbs = [
    { title: t('auth:profile.title'), href: '/profile' },
    { title: t('auth:profile.editTitle'), href: '/profile/edit' }
  ];


  return (
    <FormLayout
      title={t('auth:profile.editTitle')}
      breadcrumbs={breadcrumbs}
      showBackButton={true}
      loading={loading}
      error={error}
      onClearError={clearError}
    >
      <UserForm
        user={authUser}
        onSubmit={handleSubmit}
        loading={loading}
        submitLabel={t('users:form.update')}
        isProfileEdit={true}
        showRoleManagement={hasPermission(PERMISSIONS.USER_EDIT_ROLES)}
      />
    </FormLayout>
  );
};

export default ProfileEditPage;
