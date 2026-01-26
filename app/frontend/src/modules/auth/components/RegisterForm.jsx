import { useEffect } from 'react';
import { TextInput, PasswordInput, Button, Group, Alert,
         LoadingOverlay, Box } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconAlertCircle } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useUniqueCheck } from '../../../common/hooks/useUniqueCheck';
import UniqueTextField from '../../../common/components/UniqueTextField';


const RegisterForm = ({ 
  onSubmit, 
  loading = false, 
  error = null,
  onClearError 
}) => {
  
  const { 
    isAvailable, 
    isChecking, 
    checkAvailability 
  } = useUniqueCheck('username', { minLength: 3, maxLength: 50 });
  const { t } = useTranslation(['common', 'auth', 'users']);


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
        if (!value.trim()) return t('common:validation.required');
        if (value.length < 3) return t('common:validation.minLength', { count: 3 });
        if (value.length > 50) return t('common:validation.maxLength', { count: 50 });
        return null;
      },
      firstName: (value) => 
        value && value.length > 100 ? t('common:validation.maxLength', { count: 100 }) : null,
      lastName: (value) => 
        value && value.length > 100 ? t('common:validation.maxLength', { count: 100 }) : null,
      password: (value) => {
        if (!value) return t('common:validation.required');
        if (value.length < 4) return t('common:validation.minLength', { count: 4 });
        return null;
      },
      confirmPassword: (value, values) => 
        value !== values.password ? t('users:validation.passwordsMatch') : null,
    },
  });

  
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      checkAvailability(form.values.username);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [form.values.username]);


  const handleSubmit = (values) => {
    onSubmit(values);
  };


  return (
    <Box pos="relative">
      <LoadingOverlay visible={loading} overlayblur={2} />
      
      <form onSubmit={form.onSubmit(handleSubmit)}>
        {error && (
          <Alert
            icon={<IconAlertCircle size="1rem" />}
            title={t('auth:register.registrationError')}
            color="red"
            mb="md"
            withCloseButton
            onClose={onClearError}
          >
            {error}
          </Alert>
        )}

        <UniqueTextField
          label={t('users:form.username')}
          placeholder={t('users:form.usernamePlaceholder')}
          required
          isChecking={isChecking}
          isAvailable={isAvailable}
          description={t('auth:register.usernameDescription')}
          {...form.getInputProps('username')}
          disabled={loading}
        />

        <TextInput
          label={t('users:form.firstName')}
          placeholder={t('users:form.firstNamePlaceholder')}
          mt="md"
          description={t('auth:register.nameDescription')}
          {...form.getInputProps('firstName')}
          disabled={loading}
        />

        <TextInput
          label={t('users:form.lastName')}
          placeholder={t('users:form.lastNamePlaceholder')}
          mt="md"
          description={t('auth:register.nameDescription')}
          {...form.getInputProps('lastName')}
          disabled={loading}
        />

        <PasswordInput
          label={t('users:form.password')}
          placeholder={t('users:form.passwordPlaceholder')}
          required
          mt="md"
          description={t('auth:register.passwordDescription')}
          {...form.getInputProps('password')}
          disabled={loading}
        />

        <PasswordInput
          label={t('users:form.confirmPassword')}
          placeholder={t('users:form.confirmPasswordPlaceholder')}
          required
          mt="md"
          {...form.getInputProps('confirmPassword')}
          disabled={loading}
        />

        <Group justify="center" mt="xl">
          <Button 
            type="submit" 
            loading={loading}
            disabled={loading || isChecking || !isAvailable}
          >
            {t('auth:register.submit')}
          </Button>
        </Group>
      </form>
    </Box>
  );
};

export default RegisterForm;
