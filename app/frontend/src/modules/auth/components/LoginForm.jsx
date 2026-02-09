import { TextInput, PasswordInput, Button, Group, Alert } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconAlertCircle } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';


const LoginForm = ({ 
  onSubmit, 
  loading = false, 
  error = null,
  onClearError 
}) => {
  
  const { t } = useTranslation(['common', 'auth', 'users']);


  const form = useForm({
    initialValues: {
      username: '',
      password: '',
    },
    validate: {
      username: (value) => (value?.trim().length > 0 ? null : t('common:validation.required')),
      password: (value) => (value ? null : t('common:validation.required')),
    },
  });

  const handleSubmit = (values) => {
    onSubmit(values);
  };
  

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      {error && (
        <Alert
          icon={<IconAlertCircle size="1rem" />}
          title={t('common:error.generic')}
          color="red"
          mb="md"
          withCloseButton
          onClose={onClearError}
        >
          {error}
        </Alert>
      )}

      <TextInput
        label={t('users:form.username')}
        placeholder={t('users:form.usernamePlaceholder')}
        required
        {...form.getInputProps('username')}
        disabled={loading}
      />

      <PasswordInput
        label={t('users:form.password')}
        placeholder={t('users:form.passwordPlaceholder')}
        required
        mt="md"
        {...form.getInputProps('password')}
        disabled={loading}
      />

      <Group justify="center" mt="xl">
        <Button 
          type="submit" 
          loading={loading}
          disabled={loading}
        >
          {t('auth:login.submit')}
        </Button>
      </Group>
    </form>
  );
};

export default LoginForm;
