import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { LoadingOverlay, Text, Center } from '@mantine/core';
import { useTranslation } from 'react-i18next';


const ProtectedRoute = ({ children, requiredRole = null }) => {
  
  const { isAuthenticated, loading, user } = useAuth();
  const { t } = useTranslation('common');


  if (loading) {
    return <LoadingOverlay visible={true} />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole) {
    const hasRequiredRole = user?.roleNames?.includes(requiredRole);
    
    if (!hasRequiredRole) {
      return (
        <Center style={{ height: '60vh' }}>
          <Text color="red" size="xl" weight={500}>
            {t('error.accessDenied')}
          </Text>
        </Center>
      );
    }
  }

  return children;
};

export default ProtectedRoute;
