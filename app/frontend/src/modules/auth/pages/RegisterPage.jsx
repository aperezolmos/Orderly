import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LoadingOverlay, Box, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../context/AuthContext';
import AuthLayout from '../layouts/AuthLayout';
import RegisterForm from '../components/RegisterForm';


const RegisterPage = () => {
  
  const { register, error, clearError, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation(['common', 'auth']);


  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleRegister = async (values) => {
    try {
      await register(values);
      navigate('/', { replace: true });
    } 
    catch (err) {
      console.error('Registration failed:', err);
    }
  };

  const loginLink = (
    <Link to="/login" style={{ textDecoration: 'none' }}>
      <Text component="span" color="blue" weight={500}>
        {t('auth:login.submit')}
      </Text>
    </Link>
  );


  return (
    <AuthLayout
      title={t('auth:register.title')}
      subtitle={t('auth:register.loginPrompt')}
      linkComponent={loginLink}
    >
      <Box pos="relative">
        <LoadingOverlay visible={loading} overlayblur={2} />
        <RegisterForm
          onSubmit={handleRegister}
          loading={loading}
          error={error}
          onClearError={clearError}
        />
      </Box>
    </AuthLayout>
  );
};

export default RegisterPage;
