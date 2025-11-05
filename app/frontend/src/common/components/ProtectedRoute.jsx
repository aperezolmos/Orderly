import React from 'react';
import { useAuth } from '../../context/useAuth';


const ProtectedRoute = ({ children }) => {
  
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">Restricted access</h2>
          <p>You must log in to access this page.</p>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
