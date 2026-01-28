import { useEffect } from 'react';
import { TextInput, PasswordInput, Button, Group, 
         LoadingOverlay, Tabs, Alert, Text, Divider } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconAlertCircle, IconUser, IconShield } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import RoleTransferList from './RoleTransferList';
import { useUniqueCheck } from '../../../common/hooks/useUniqueCheck';
import UniqueTextField from '../../../common/components/UniqueTextField';
import { useUserRoles } from '../hooks/useUserRoles';


const UserForm = ({
  user = null,
  onSubmit,
  loading = false,
  submitLabel = "Save",
  showRoleManagement = false,
  isProfileEdit = false
}) => {
  
  const { 
    isAvailable, 
    isChecking, 
    checkAvailability 
  } = useUniqueCheck('username', { minLength: 3, maxLength: 50 });
  const { t } = useTranslation(['common', 'users']);


  const initialUserRoleIds = user?.roleIds || [];
  const {
    assignedRoles,
    availableRoles,
    loading: rolesLoading,
    loadAllRoles,
    addRole,
    removeRole,
    getAssignedRoleIds,
    hasChanges: rolesHaveChanges
  } = useUserRoles(initialUserRoleIds);


  useEffect(() => {
    if (showRoleManagement) loadAllRoles();
  }, [loadAllRoles]);

  useEffect(() => {
    form.setFieldValue('roleIds', getAssignedRoleIds());
  }, [assignedRoles]);


  const form = useForm({
    initialValues: {
      username: '',
      firstName: '',
      lastName: '',
      currentPassword: '',
      password: '',
      confirmPassword: '',
    },
    validate: {
      username: (value) => {
        if (!value) return t('common:validation.required');
        if (value.length < 3) return t('common:validation.minLength', { count: 3 });
        if (value.length > 50) return t('common:validation.maxLength', { count: 50 });
        if (user && user.username === value) return null;
        return null;
      },
      firstName: (value) => {
        if (value && value.length > 100) return t('common:validation.maxLength', { count: 100 });
        return null;
      },
      lastName: (value) => {
        if (value && value.length > 100) return t('common:validation.maxLength', { count: 100 });
        return null;
      },
      currentPassword: (value, values) => {
        if (isProfileEdit && values.password && !value) {
          return t('users:validation.currentPasswordRequired'); 
        }
        return null;
      },
      password: (value) => {
        if (!user && !value) return t('common:validation.required');
        if (value && value.length < 4) return t('common:validation.minLength', { count: 4 });
        return null;
      },
      confirmPassword: (value, values) => {
        if (!user && !value) return t('common:validation.required');
        if (value !== values.password) return t('users:validation.passwordsMatch');
        return null;
      },
    },
    validateInputOnChange: true,
  });


  // Load user data when editing
  useEffect(() => {
    if (user) {
      form.setValues({
        username: user.username || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        currentPassword: '',
        password: '', // Do not load password for security
        confirmPassword: '',
      });
    }
  }, [user]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      checkAvailability(form.values.username, user?.username);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [form.values.username]);


  const handleSubmit = async (values) => {
    const userData = {
      username: values.username,
      firstName: values.firstName || null,
      lastName: values.lastName || null,
      currentPassword: isProfileEdit ? values.currentPassword : undefined,
      password: values.password || undefined, // Only send if provided
      confirmPassword: values.confirmPassword || undefined,
      roleIds: showRoleManagement ? getAssignedRoleIds() : undefined
    };

    // Clean up undefined fields
    Object.keys(userData).forEach(key => {
      if (userData[key] === undefined || userData[key] === '') delete userData[key];
    });

    await onSubmit(userData);
  };
  

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <LoadingOverlay visible={loading || rolesLoading} />

      <Tabs defaultValue="basic">
        <Tabs.List>
          <Tabs.Tab value="basic" leftSection={<IconUser size="0.8rem" />}>
            {t('common:form.basicInfo')}
          </Tabs.Tab>
          {showRoleManagement && (
            <Tabs.Tab value="roles" leftSection={<IconShield size="0.8rem" />}>
              {t('users:form.roleManagement')}
            </Tabs.Tab>
          )}
        </Tabs.List>

        <Tabs.Panel value="basic" pt="xs">
          <UniqueTextField
            label={t('users:form.username')}
            placeholder={t('users:form.usernamePlaceholder')}
            required
            isChecking={isChecking}
            isAvailable={isAvailable}
            {...form.getInputProps('username')}
            mb="md"
            disabled={loading}
          />

          <Group grow mb="md">
            <TextInput
              label={t('users:form.firstName')}
              placeholder={t('users:form.firstNamePlaceholder')}
              {...form.getInputProps('firstName')}
            />
            <TextInput
              label={t('users:form.lastName')}
              placeholder={t('users:form.lastNamePlaceholder')}
              {...form.getInputProps('lastName')}
            />
          </Group>

          <Divider my="md" mt="xl" label={t('users:form.changePasswordTitle')} labelPosition="left" />

          <Group grow mb="xl">
            {isProfileEdit && (
              <PasswordInput
                label={t('users:form.currentPassword')}
                placeholder={t('users:form.currentPasswordPlaceholder')}
                {...form.getInputProps('currentPassword')}
              />
            )}
            <PasswordInput
              label={user ? t('users:form.newPassword') : t('users:form.password')}
              placeholder={t('users:form.passwordPlaceholder')}
              required={!user}
              {...form.getInputProps('password')}
            />
            <PasswordInput
              label={t('users:form.confirmPassword')}
              placeholder={t('users:form.confirmPasswordPlaceholder')}
              required={!user}
              {...form.getInputProps('confirmPassword')}
            />
          </Group>

          {user && (
            <Alert icon={<IconAlertCircle size="1rem" />} color="blue" mb="md">
              <Text size="sm">
                {t('users:form.passwordInfo')}
                {isProfileEdit && (". ")}{isProfileEdit && (t('users:form.passwordInfo'))}
              </Text>
            </Alert>
          )}
        </Tabs.Panel>

        {showRoleManagement && (
          <Tabs.Panel value="roles" pt="xs">
            <RoleTransferList
              assignedRoles={assignedRoles}
              availableRoles={availableRoles}
              onAddRole={addRole}
              onRemoveRole={removeRole}
              loading={loading || rolesLoading}
            />
            
            {rolesHaveChanges && (
              <Alert icon={<IconAlertCircle size="1rem" />} color="yellow" mt="md">
                <Text size="sm">
                  {t('users:form.roleChanges')}
                </Text>
              </Alert>
            )}
          </Tabs.Panel>
        )}
      </Tabs>

      <Group justify="flex-end" mt="xl">
        <Button 
          type="submit" 
          loading={loading}
          disabled={
            loading || isChecking || !isAvailable ||
            (!form.isDirty() && !rolesHaveChanges)
          }
        >
          {submitLabel}
        </Button>
      </Group>
    </form>
  );
};

export default UserForm;
