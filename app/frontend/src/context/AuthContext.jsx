import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';


const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if a user is logged in when loading the app
  useEffect(() => {
    checkAuthStatus();
  }, []);

  
  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      const userData = await authService.checkAuthStatus();
      setUser(userData);
      setError(null);
    } 
    catch (err) {
      setError(err.message);
      setUser(null);
    } 
    finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const userData = await authService.login(username, password);
      
      localStorage.setItem('currentUser', JSON.stringify(userData));
      setUser(userData);
      
      return userData;
    } 
    catch (err) {
      setError(err.message);
      throw err;
    } 
    finally {
      setLoading(false);
    }
  };
  
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const newUser = await authService.register(userData);
      
      // Auto-login after registration
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      setUser(newUser);
      
      return newUser;
    } 
    catch (err) {
      setError(err.message);
      throw err;
    } 
    finally {
      setLoading(false);
    }
  };
  
  const logout = async () => {
    try {
      setLoading(true);
      await authService.logout();
    } 
    finally {
      localStorage.removeItem('currentUser');
      setUser(null);
      setError(null);
      setLoading(false);
    }
  };

  const clearError = () => setError(null);
  

  // Available values in the context
  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
