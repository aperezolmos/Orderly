import { useState, useEffect } from 'react';
import { TextInput, PasswordInput, Button, Group, Alert, LoadingOverlay, Box } from '@mantine/core';
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
  
  const { t } = useTranslation(['common', 'auth', 'users']);
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
        if (!value.trim()) return t('common:validation.required');
        if (value.length < 3) return t('common:validation.minLength', { count: 3 });
        if (value.length > 50) return t('common:validation.maxLength', { count: 50 });
        if (usernameAvailable === false) return t('users:validation.usernameTaken');
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
      form.setFieldError('username', t('users:validation.usernameTaken'));
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
      return t('users:validation.checkingUsername');
    }
    if (usernameAvailable === true) {
      return t('users:validation.usernameAvailable');
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
          label={t('users:form.username')}
          placeholder={t('users:form.usernamePlaceholder')}
          required
          description={getUsernameDescription()}
          rightSection={getUsernameRightSection()}
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
