import React, { useState, useEffect } from 'react';
import { TextInput, PasswordInput, Button, Group, Alert, LoadingOverlay, Box} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconAlertCircle, IconCheck, IconX } from '@tabler/icons-react';
import { userService } from '../../../services/backend/userService';


const RegisterForm = ({ 
  onSubmit, 
  loading = false, 
  error = null,
  onClearError 
}) => {
  
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
        if (!value.trim()) return 'Username is required';
        if (value.length < 3) return 'Username must be at least 3 characters';
        if (value.length > 50) return 'Username cannot exceed 50 characters';
        if (usernameAvailable === false) return 'Username is already taken';
        return null;
      },
      firstName: (value) => 
        value && value.length > 100 ? 'First name cannot exceed 100 characters' : null,
      lastName: (value) => 
        value && value.length > 100 ? 'Last name cannot exceed 100 characters' : null,
      password: (value) => {
        if (!value) return 'Password is required';
        if (value.length < 4) return 'Password must be at least 4 characters';
        return null;
      },
      confirmPassword: (value, values) => 
        value !== values.password ? 'Passwords do not match' : null,
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
      form.setFieldError('username', 'Username is already taken');
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

  return (
    <Box pos="relative">
      <LoadingOverlay visible={loading} overlayBlur={2} />
      
      <form onSubmit={form.onSubmit(handleSubmit)}>
        {error && (
          <Alert
            icon={<IconAlertCircle size="1rem" />}
            title="Registration Error"
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
          placeholder="Choose a username"
          required
          description="3-50 characters"
          rightSection={getUsernameRightSection()}
          {...form.getInputProps('username')}
          disabled={loading}
        />

        <TextInput
          label="First Name (Optional)"
          placeholder="Your first name"
          mt="md"
          description="Max 100 characters"
          {...form.getInputProps('firstName')}
          disabled={loading}
        />

        <TextInput
          label="Last Name (Optional)"
          placeholder="Your last name"
          mt="md"
          description="Max 100 characters"
          {...form.getInputProps('lastName')}
          disabled={loading}
        />

        <PasswordInput
          label="Password"
          placeholder="Your password"
          required
          mt="md"
          description="At least 4 characters"
          {...form.getInputProps('password')}
          disabled={loading}
        />

        <PasswordInput
          label="Confirm Password"
          placeholder="Confirm your password"
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
            Create Account
          </Button>
        </Group>
      </form>
    </Box>
  );
};

export default RegisterForm;
