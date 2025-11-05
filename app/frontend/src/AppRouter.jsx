import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/useAuth';
import ProtectedRoute from './common/components/ProtectedRoute';


const Login = React.lazy(() => import('./modules/auth/pages/LoginPage'));
//const Register = React.lazy(() => import('./modules/auth/pages/RegisterPage'));
const Profile = React.lazy(() => import('./modules/auth/pages/ProfilePage'));
const Dashboard = React.lazy(() => import('./Dashboard'));


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
            element={!isAuthenticated ? <Login /> : <Navigate to="/profile" />}
          />


          {/* Protected routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />


          {/* Default route */}
          <Route
            path="/"
            element={<Navigate to={isAuthenticated ? "/profile" : "/login"} />}
          />

          {/* 404 route */}
          <Route path="*" element={<div>Page not found</div>} />
        </Routes>
      </React.Suspense>
    </Router>
  );
};

export default AppRouter;
