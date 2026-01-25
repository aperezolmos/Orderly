import { useEffect, useState } from 'react';
import { TextInput, PasswordInput, Button, Group, 
         LoadingOverlay, Tabs, Alert, Text, Loader } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconAlertCircle, IconUser, IconShield,
         IconCheck, IconX } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import RoleTransferList from './RoleTransferList';
import { useUserRoles } from '../hooks/useUserRoles';
import { useUsernameCheck } from '../hooks/useUsernameCheck';


const UserForm = ({
  user = null,
  onSubmit,
  loading = false,
  submitLabel = "Create User",
  showRoleManagement = true
}) => {
  
  const { checkUsernameAvailability, checkingUsername } = useUsernameCheck();
  const [usernameAvailable, setUsernameAvailable] = useState(true);
  const { t } = useTranslation(['common', 'users']);


  const initialUserRoleIds = user?.roleIds || [];
  const {
    assignedRoles,
    availableRoles,
    loading: rolesLoading,
    addRole,
    removeRole,
    getAssignedRoleIds,
    hasChanges: rolesHaveChanges
  } = useUserRoles(initialUserRoleIds);


  useEffect(() => {
    form.setFieldValue('roleIds', getAssignedRoleIds());
  }, [assignedRoles]);

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
        if (!value) return t('common:validation.required');
        if (value.length < 3) return t('common:validation.minLength', { count: 3 });
        if (value.length > 50) return t('common:validation.maxLength', { count: 50 });
        if (user && user.username === value) return null;
        if (usernameAvailable === false) return t('users:validation.usernameTaken');
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
      firstName: (value) => {
        if (value && value.length > 100) return t('common:validation.maxLength', { count: 100 });
        return null;
      },
      lastName: (value) => {
        if (value && value.length > 100) return t('common:validation.maxLength', { count: 100 });
        return null;
      },
    },
  });

  
  // Check if username is available
  useEffect(() => {
    const username = form.values.username.trim();
    if (!username || username.length < 3) {
      setUsernameAvailable(true);
      return;
    }
    
    // If editing and username unchanged, skip check
    if (user && user.username === username) {
      setUsernameAvailable(true);
      return;
    }
    
    const timeoutId = setTimeout(async () => {
      const available = await checkUsernameAvailability(username, user?.username);
      setUsernameAvailable(available);
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [form.values.username, user, checkUsernameAvailability]);


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
  
  const getUsernameRightSection = () => {
    const username = form.values.username.trim();
    if (!username || username.length < 3) return null;

    // If editing and username unchanged, show green check
    if (user && user.username === username) {
      return <IconCheck size="1rem" color="green" />;
    }

    if (checkingUsername) {
      return <Loader size="xs" />;
    }
    if (usernameAvailable === true) {
      return <IconCheck size="1rem" color="green" />;
    }
    if (usernameAvailable === false) {
      return <IconX size="1rem" color="red" />;
    }
    return null;
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <LoadingOverlay visible={loading || rolesLoading} />

      <Tabs defaultValue="basic">
        <Tabs.List>
          <Tabs.Tab value="basic" icon={<IconUser size="0.8rem" />}>
            {t('common:form.basicInfo')}
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
            rightSection={getUsernameRightSection()}
            mb="md"
            disabled={loading}
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
