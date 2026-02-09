import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingFallback from './feedback/LoadingFallback';
import AccessDeniedView from './feedback/AccessDeniedView';
import MainLayout from '../layouts/MainLayout';


const ProtectedRoute = ({ children, requiredPermissions = [], allRequired = false }) => {
  
  const { isAuthenticated, loading, permissions } = useAuth();


  if (loading) return <LoadingFallback />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (requiredPermissions.length === 0) return children;

  const hasPermission = allRequired
    ? requiredPermissions.every(p => permissions.includes(p))
    : requiredPermissions.some(p => permissions.includes(p));
  

  if (!hasPermission) {
    return (
      <MainLayout>
        <AccessDeniedView />
      </MainLayout>
    );
  }

  return children;
};

export default ProtectedRoute;
