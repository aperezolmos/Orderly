import { useEffect, useState } from 'react';
import { TextInput, PasswordInput, Button, Group, 
         LoadingOverlay, Tabs, Alert, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconAlertCircle, IconUser, IconShield } from '@tabler/icons-react';
import { userService } from '../../../services/backend/userService';
import RoleTransferList from '../../roles/components/RoleTransferList';
import { useUserRoles } from '../hooks/useUserRoles';
import { useTranslation } from 'react-i18next';


const UserForm = ({
  user = null,
  onSubmit,
  loading = false,
  submitLabel = "Create User",
  showRoleManagement = true
}) => {
  
  const [usernameAvailable, setUsernameAvailable] = useState(true);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const { t } = useTranslation(['common', 'users']);


  // Initialize user roles
  const initialUserRoles = user?.roleNames ? 
    user.roleNames.map((name, index) => ({
      id: user.roleIds?.[index] || index,
      name: name
    })) : [];

  const {
    assignedRoles,
    availableRoles,
    loading: rolesLoading,
    addRole,
    removeRole,
    getAssignedRoleIds,
    hasChanges: rolesHaveChanges
  } = useUserRoles(initialUserRoles);

  const form = useForm({
    initialValues: {
      username: '',
      firstName: '',
      lastName: '',
      password: '',
      confirmPassword: '',
    },
    validate: {
      username: (value) => {
        if (!value) return t('users:validation.usernameRequired');
        if (value.length < 3) return t('users:validation.usernameMinLength');
        if (value.length > 50) return t('users:validation.usernameMaxLength');
        if (!usernameAvailable) return t('auth:validation.usernameTaken');
        return null;
      },
      password: (value) => {
        if (!user && !value) return t('users:validation.passwordRequired');
        if (value && value.length < 4) return t('users:validation.passwordMinLength');
        return null;
      },
      confirmPassword: (value, values) => {
        if (!user && !value) return t('users:validation.confirmPasswordRequired');
        if (value !== values.password) return t('users:validation.passwordsMatch');
        return null;
      },
      firstName: (value) => {
        if (value && value.length > 100) return t('users:validation.firstNameMaxLength');
        return null;
      },
      lastName: (value) => {
        if (value && value.length > 100) return t('users:validation.lastNameMaxLength');
        return null;
      },
    },
  });

  // Verify username availability
  const checkUsernameAvailability = async (username) => {
    if (username.length < 3) {
      setUsernameAvailable(true);
      return;
    }

    // If we are editing and the username hasn't changed, it's available
    if (user && user.username === username) {
      setUsernameAvailable(true);
      return;
    }

    setCheckingUsername(true);
    try {
      const available = await userService.checkUsernameAvailability(username);
      setUsernameAvailable(available);
    } 
    catch (error) {
      setUsernameAvailable(false);
      console.error('Error:', error);
    } 
    finally {
      setCheckingUsername(false);
    }
  };

  // Load user data when editing
  useEffect(() => {
    if (user) {
      form.setValues({
        username: user.username || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        password: '', // Do not load password for security
        confirmPassword: '',
      });
      setUsernameAvailable(true);
    }
  }, [user]);

  const handleSubmit = async (values) => {
    const userData = {
      username: values.username,
      firstName: values.firstName || null,
      lastName: values.lastName || null,
      password: values.password || undefined, // Only send if provided
      confirmPassword: values.confirmPassword || undefined,
      roleIds: showRoleManagement ? getAssignedRoleIds() : undefined
    };

    // Clean up undefined fields
    Object.keys(userData).forEach(key => {
      if (userData[key] === undefined) {
        delete userData[key];
      }
    });

    await onSubmit(userData);
  };
  

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <LoadingOverlay visible={loading || rolesLoading} />

      <Tabs defaultValue="basic">
        <Tabs.List>
          <Tabs.Tab value="basic" icon={<IconUser size="0.8rem" />}>
            {t('users:form.basicInfo')}
          </Tabs.Tab>
          {showRoleManagement && (
            <Tabs.Tab value="roles" icon={<IconShield size="0.8rem" />}>
              {t('users:form.roleManagement')}
            </Tabs.Tab>
          )}
        </Tabs.List>

        <Tabs.Panel value="basic" pt="xs">
          <TextInput
            label={t('users:form.username')}
            placeholder={t('users:form.usernamePlaceholder')}
            required
            maxLength={50}
            {...form.getInputProps('username')}
            onBlur={(e) => checkUsernameAvailability(e.target.value)}
            error={form.errors.username}
            rightSection={checkingUsername ? <div>{t('auth:register.checkingUsername')}</div> : null}
            mb="md"
          />

          <Group grow mb="md">
            <TextInput
              label={t('users:form.firstName')}
              placeholder={t('users:form.firstNamePlaceholder')}
              maxLength={100}
              {...form.getInputProps('firstName')}
            />
            <TextInput
              label={t('users:form.lastName')}
              placeholder={t('users:form.lastNamePlaceholder')}
              maxLength={100}
              {...form.getInputProps('lastName')}
            />
          </Group>

          <Group grow mb="xl">
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
              <Alert color="yellow" mt="md">
                <Text size="sm">
                  {t('users:form.roleChanges')}
                </Text>
              </Alert>
            )}
          </Tabs.Panel>
        )}
      </Tabs>

      <Group position="right" mt="xl">
        <Button 
          type="submit" 
          loading={loading}
          disabled={!form.isDirty() && !rolesHaveChanges}
        >
          {submitLabel}
        </Button>
      </Group>
    </form>
  );
};

export default UserForm;
