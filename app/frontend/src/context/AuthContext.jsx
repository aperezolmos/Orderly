import { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/backend/authService';


const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
  
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if a user is logged in when loading the app
  useEffect(() => {
    checkAuthStatus();
  }, []);

  
  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      const userData = await authService.getCurrentUser();
      setUser(userData);

      try {
        const perms = await authService.getCurrentUserPermissions();
        setPermissions(perms || []);
        console.log('Permisos obtenidos (checkAuthStatus):', perms);
      } 
      catch (pErr) {
        console.warn('No se pudieron obtener permisos tras recarga:', pErr); //TODO: borrar
        setPermissions([]);
      }

      setError(null);
    } 
    catch (err) {
      setError(err.message);
      setUser(null);
      setPermissions([]);
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
      setUser(userData);

      try {
        const perms = await authService.getCurrentUserPermissions();
        setPermissions(perms || []);
        console.log('Permisos obtenidos (login):', perms);
      } 
      catch (pErr) {
        console.warn('No se pudieron obtener permisos tras login:', pErr); //TODO: borrar
        setPermissions([]);
      }
      
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
      setUser(newUser);

      try {
        const perms = await authService.getCurrentUserPermissions();
        setPermissions(perms || []);
        console.log('Permisos obtenidos (register):', perms);
      } 
      catch (pErr) {
        console.warn('No se pudieron obtener permisos tras register:', pErr);
        setPermissions([]);
      }
      
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
      setUser(null);
      setPermissions([]);
      setError(null);
      setLoading(false);
    }
  };

  const clearError = () => setError(null);
  

  // Available values in the context
  const value = {
    user,
    permissions,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
    isAuthenticated: !!user,
    hasPermission: (perm) => permissions?.includes(perm) || false
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
