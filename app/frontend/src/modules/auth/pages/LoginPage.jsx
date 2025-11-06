import React, { useEffect } from 'react';
import { Text, LoadingOverlay } from '@mantine/core';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/useAuth';
import { notifications } from '@mantine/notifications';
import AuthLayout from '../components/AuthLayout';
import LoginForm from '../components/LoginForm';


const LoginPage = () => {
  
  const { login, error, clearError, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/profile', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (values) => {
    try {
      await login(values.username, values.password);
      notifications.show({
        title: 'Welcome!',
        message: 'Login successful',
        color: 'green',
      });
      navigate('/profile', { replace: true });
    } 
    catch (err) {
      console.error('Login failed:', err);
    }
  };

  const registerLink = (
    <Link to="/register" style={{ textDecoration: 'none' }}>
      <Text component="span" color="blue" weight={500}>
        Create account
      </Text>
    </Link>
  );


  return (
    <AuthLayout
      title="Welcome back!"
      subtitle="Don't have an account?"
      linkComponent={registerLink}
    >
      <div style={{ position: 'relative' }}>
        <LoadingOverlay visible={loading} overlayBlur={2} />
        
        <LoginForm
          onSubmit={handleLogin}
          loading={loading}
          error={error}
          onClearError={clearError}
        />

        <Text size="sm" color="dimmed" mt="md" align="center">
          <Link to="/forgot-password" style={{ textDecoration: 'none' }}>
            Forgot your password?
          </Link>
        </Text>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
