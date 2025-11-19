import React, { useEffect } from 'react';
import { Text, LoadingOverlay } from '@mantine/core';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/useAuth';
import { notifications } from '@mantine/notifications';
import AuthLayout from '../components/AuthLayout';
import LoginForm from '../components/LoginForm';
import { useTranslationWithLoading } from '../../../common/hooks/useTranslationWithLoading';


const LoginPage = () => {
  
  const { login, error, clearError, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslationWithLoading(['common', 'auth']);


  useEffect(() => {
    if (isAuthenticated) {
      navigate('/profile', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (values) => {
    try {
      await login(values.username, values.password);
      notifications.show({
        title: t('common:app.success'),
        message: t('auth:login.success'),
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
        {t('auth:register.submit')}
      </Text>
    </Link>
  );


  return (
    <AuthLayout
      title={t('auth:login.title')}
      subtitle={t('auth:login.registerPrompt')}
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
            {t('auth:login.forgotPassword')}
          </Link>
        </Text>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
