import React, { useState, useEffect } from 'react';
import { TextInput, PasswordInput, Button, Group, Alert, LoadingOverlay, Box, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconAlertCircle, IconCheck, IconX } from '@tabler/icons-react';
import { userService } from '../../../services/backend/userService';
import { useTranslation } from 'react-i18next';


const RegisterForm = ({ 
  onSubmit, 
  loading = false, 
  error = null,
  onClearError 
}) => {
  
  const { t } = useTranslation(['common', 'auth']);
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [checkingUsername, setCheckingUsername] = useState(false);

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
        if (!value.trim()) return t('auth:validation.usernameRequired');
        if (value.length < 3) return t('auth:validation.usernameMinLength');
        if (value.length > 50) return t('auth:validation.usernameMaxLength');
        if (usernameAvailable === false) return t('auth:validation.usernameTaken');
        return null;
      },
      firstName: (value) => 
        value && value.length > 100 ? t('auth:validation.firstNameMaxLength') : null,
      lastName: (value) => 
        value && value.length > 100 ? t('auth:validation.lastNameMaxLength') : null,
      password: (value) => {
        if (!value) return t('auth:validation.passwordRequired');
        if (value.length < 4) return t('auth:validation.passwordMinLength');
        return null;
      },
      confirmPassword: (value, values) => 
        value !== values.password ? t('auth:validation.passwordsMatch') : null,
    },
  });

  // Check if username is available
  useEffect(() => {
    const username = form.values.username.trim();
    
    if (username.length >= 3 && username.length <= 50) {
      const checkUsername = async () => {
        setCheckingUsername(true);
        try {
          const available = await userService.checkUsernameAvailability(username);
          setUsernameAvailable(available);
        } 
        catch (error) {
          console.error('Error checking username:', error);
          setUsernameAvailable(null);
        } 
        finally {
          setCheckingUsername(false);
        }
      };

      const timeoutId = setTimeout(checkUsername, 500);
      return () => clearTimeout(timeoutId);
    } 
    else {
      setUsernameAvailable(null);
    }
  }, [form.values.username]);

  const handleSubmit = (values) => {
    if (usernameAvailable === false) {
      form.setFieldError('username', t('auth:validation.usernameTaken'));
      return;
    }
    onSubmit(values);
  };

  const getUsernameRightSection = () => {
    const username = form.values.username.trim();
    
    if (!username || username.length < 3) return null;
    
    if (checkingUsername) {
      return <LoadingOverlay visible={true} overlayBlur={2} />;
    }
    
    if (usernameAvailable === true) {
      return <IconCheck size="1rem" color="green" />;
    }
    
    if (usernameAvailable === false) {
      return <IconX size="1rem" color="red" />;
    }
    
    return null;
  };

  const getUsernameDescription = () => {
    if (checkingUsername) {
      return t('auth:register.checkingUsername');
    }
    if (usernameAvailable === true) {
      return t('auth:register.usernameAvailable');
    }
    return t('auth:register.usernameDescription');
  };


  return (
    <Box pos="relative">
      <LoadingOverlay visible={loading} overlayBlur={2} />
      
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

        <TextInput
          label={t('auth:register.username')}
          placeholder={t('auth:register.username')}
          required
          description={getUsernameDescription()}
          rightSection={getUsernameRightSection()}
          {...form.getInputProps('username')}
          disabled={loading}
        />

        <TextInput
          label={t('auth:register.firstName')}
          placeholder={t('auth:register.firstName')}
          mt="md"
          description={t('auth:register.nameDescription')}
          {...form.getInputProps('firstName')}
          disabled={loading}
        />

        <TextInput
          label={t('auth:register.lastName')}
          placeholder={t('auth:register.lastName')}
          mt="md"
          description={t('auth:register.nameDescription')}
          {...form.getInputProps('lastName')}
          disabled={loading}
        />

        <PasswordInput
          label={t('auth:register.password')}
          placeholder={t('auth:register.password')}
          required
          mt="md"
          description={t('auth:register.passwordDescription')}
          {...form.getInputProps('password')}
          disabled={loading}
        />

        <PasswordInput
          label={t('auth:register.confirmPassword')}
          placeholder={t('auth:register.confirmPassword')}
          required
          mt="md"
          {...form.getInputProps('confirmPassword')}
          disabled={loading}
        />

        <Group position="right" mt="xl">
          <Button 
            type="submit" 
            loading={loading}
            disabled={loading || checkingUsername || usernameAvailable === false}
          >
            {t('auth:register.submit')}
          </Button>
        </Group>
      </form>
    </Box>
  );
};

export default RegisterForm;
