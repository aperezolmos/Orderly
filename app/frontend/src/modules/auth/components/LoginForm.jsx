import React from 'react';
import { TextInput, PasswordInput, Button, Group,Alert } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconAlertCircle } from '@tabler/icons-react';


const LoginForm = ({ 
  onSubmit, 
  loading = false, 
  error = null,
  onClearError 
}) => {
  
  const form = useForm({
    initialValues: {
      username: '',
      password: '',
    },
    validate: {
      username: (value) => !value.trim() ? 'Username is required' : null,
      password: (value) => !value ? 'Password is required' : null,
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
          title="Error"
          color="red"
          mb="md"
          withCloseButton
          onClose={onClearError}
        >
          {error}
        </Alert>
      )}

      <TextInput
        label="Username"
        placeholder="Your username"
        required
        {...form.getInputProps('username')}
        disabled={loading}
      />

      <PasswordInput
        label="Password"
        placeholder="Your password"
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
          Sign in
        </Button>
      </Group>
    </form>
  );
};

export default LoginForm;
