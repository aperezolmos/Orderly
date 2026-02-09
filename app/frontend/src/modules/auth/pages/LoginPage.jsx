import { useEffect } from 'react';
import { Text, LoadingOverlay, Box, Alert} from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../context/AuthContext';
import AuthLayout from '../layouts/AuthLayout';
import LoginForm from '../components/LoginForm';


const LoginPage = () => {
  
  const { login, error, clearError, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation(['common', 'auth']);


  const infoMessage = location.state?.reason === 'username_changed' 
    ? t('auth:login.alerts.usernameChanged') 
    : null;


  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (values) => {
    try {
      await login(values.username, values.password);
      navigate('/', { replace: true });
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
      <Box pos="relative">
        {infoMessage && (
          <Alert color="blue" icon={<IconInfoCircle />} mb="md" title={t('auth:login.alerts.notice')}>
            {infoMessage}
          </Alert>
        )}
        <LoadingOverlay visible={loading} overlayblur={2} />
        
        <LoginForm
          onSubmit={handleLogin}
          loading={loading}
          error={error}
          onClearError={clearError}
        />
      </Box>
    </AuthLayout>
  );
};

export default LoginPage;
