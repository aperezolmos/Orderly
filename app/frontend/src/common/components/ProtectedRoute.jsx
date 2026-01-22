import { Navigate } from 'react-router-dom';
import { LoadingOverlay, Text, Center } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';


const ProtectedRoute = ({ children, requiredPermissions = [], allRequired = false }) => {
  
  const { isAuthenticated, loading, permissions } = useAuth();
  const { t } = useTranslation('common');

  if (loading) return <LoadingOverlay visible={true} />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (requiredPermissions.length === 0) return children;

  const hasPermission = allRequired
    ? requiredPermissions.every(p => permissions.includes(p))
    : requiredPermissions.some(p => permissions.includes(p));

  // console.log("Permisos requeridos ruta navegada:", requiredPermissions);
  // console.log("Permisos usuario actual:", permissions);
  // console.log("Tiene SOME permisos?:", requiredPermissions.some(p => permissions.includes(p)));
  // console.log("Tiene EVERY permisos?:", requiredPermissions.every(p => permissions.includes(p)));

  if (!hasPermission) {
    return (
      <Center style={{ height: '60vh' }}>
        <Text color="red" size="xl" fw={500}>
          {t('common:error.accessDenied')}
        </Text>
      </Center>
    );
  }

  return children;
};

export default ProtectedRoute;
