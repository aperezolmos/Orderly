import React from 'react';
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
  
  const { t } = useTranslation(['common', 'auth']);


  const form = useForm({
    initialValues: {
      username: '',
      password: '',
    },
    validate: {
      username: (value) => !value.trim() ? t('auth:validation.usernameRequired') : null,
      password: (value) => !value ? t('auth:validation.passwordRequired') : null,
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
        label={t('auth:login.username')}
        placeholder={t('auth:login.username')}
        required
        {...form.getInputProps('username')}
        disabled={loading}
      />

      <PasswordInput
        label={t('auth:login.password')}
        placeholder={t('auth:login.password')}
        required
        mt="md"
        {...form.getInputProps('password')}
        disabled={loading}
      />

      <Group position="right" mt="xl">
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
