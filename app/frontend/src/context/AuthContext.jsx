import { createContext, useState, useEffect, useContext } from 'react';
import { notifications } from '@mantine/notifications';
import { useTranslation } from 'react-i18next';
import { authService } from '../services/backend/authService';


const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
  
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useTranslation(['auth']);


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
      } 
      catch {
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

        notifications.show({
          title: t('common:app.success'),
          message: t('auth:login.success'),
          color: 'green',
        });
      } 
      catch {
        setPermissions([]);
      }
      
      return userData;
    } 
    catch (err) {
      if (err.status === 400) {
        setError(t('auth:login.errors.invalidCredentials'));
      }
      else {
        setError(err.message);
      }
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

        notifications.show({
          title: t('common:app.welcome'),
          message: t('auth:register.success'),
          color: 'green',
        });
      } 
      catch {
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
    setLoading(true);
    await authService.logout();
      
    setUser(null);
    setPermissions([]);
    setError(null);
    setLoading(false);
  };

  const clearError = () => setError(null);
  

  // Available values in the context
  const value = {
    user,
    permissions,
    loading,
    error,
    checkAuthStatus,
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
