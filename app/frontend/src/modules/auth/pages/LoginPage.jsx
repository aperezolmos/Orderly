import React, { useEffect } from 'react';
import { Container, Paper, Title, Text, LoadingOverlay } from '@mantine/core';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/useAuth';
//import { notifications } from '@mantine/notifications';
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
      /*notifications.show({
        title: 'Welcome!',
        message: 'Login successful',
        color: 'green',
      });*/
      navigate('/profile', { replace: true });
    } 
    catch (err) {
      console.error('Login failed:', err);
    }
  };


  return (
    <Container size={420} my={40}>
      <div style={{ textAlign: 'center' }}>
        <Title order={2} style={{ fontWeight: 900 }}>
          Welcome back!
        </Title>
        <Text color="dimmed" size="sm" mt={5}>
          Don't have an account?{' '}
          <Link to="/register">
            <Text component="span" color="blue" weight={500}>
              Create account
            </Text>
          </Link>
        </Text>
      </div>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md" pos="relative">
        <LoadingOverlay visible={loading} overlayBlur={2} />
        
        <LoginForm
          onSubmit={handleLogin}
          loading={loading}
          error={error}
          onClearError={clearError}
        />

        <Text size="sm" color="dimmed" mt="md" align="center">
          <Link to="/forgot-password">
            Forgot your password?
          </Link>
        </Text>
      </Paper>
    </Container>
  );
};

export default LoginPage;
