import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/useAuth';
import ProtectedRoute from './common/components/ProtectedRoute';


// ------- PAGES ------------------------------------------
// Auth
const Login = React.lazy(() => import('./modules/auth/pages/LoginPage'));
const Register = React.lazy(() => import('./modules/auth/pages/RegisterPage'));
const Profile = React.lazy(() => import('./modules/auth/pages/ProfilePage'));

// Role
const RoleList = React.lazy(() => import('./modules/roles/pages/RoleListPage'));
const RoleCreate = React.lazy(() => import('./modules/roles/pages/RoleCreatePage'));
const RoleEdit = React.lazy(() => import('./modules/roles/pages/RoleEditPage'));

// --------------------------------------------------------


//TODO: role_admin constante?


const AppRouter = () => {

  const { isAuthenticated, loading } = useAuth();


  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <React.Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* Public routes */}
          <Route
            path="/login"
            element={!isAuthenticated ? <Login /> : <Navigate to="/profile" replace />}
          />
          <Route
            path="/register"
            element={!isAuthenticated ? <Register /> : <Navigate to="/profile" replace />}
          />


          {/* Protected USER routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />


          {/* Protected ADMIN routes */}
          <Route
            path="/roles"
            element={
              <ProtectedRoute requiredRole="ROLE_ADMIN">
                <RoleList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/roles/new"
            element={
              <ProtectedRoute requiredRole="ROLE_ADMIN">
                <RoleCreate />
              </ProtectedRoute>
            }
          />
          <Route
            path="/roles/:id/edit"
            element={
              <ProtectedRoute requiredRole="ROLE_ADMIN">
                <RoleEdit />
              </ProtectedRoute>
            }
          />


          {/* Default route */}
          <Route
            path="/"
            element={<Navigate to={isAuthenticated ? "/profile" : "/login"} replace />}
          />

          {/* 404 route */}
          <Route path="*" element={<div>Page not found</div>} />
        </Routes>
      </React.Suspense>
    </Router>
  );
};

export default AppRouter;
