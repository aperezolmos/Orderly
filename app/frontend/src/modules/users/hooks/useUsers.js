import { useState, useEffect, useCallback } from 'react';
import { userService } from '../../../services/backend/userService';
import { notifications } from '@mantine/notifications';
import { useTranslation } from 'react-i18next';


export const useUsers = () => {
  
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { t } = useTranslation(['common', 'users']);
  

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.getUsers();
      setUsers(data);
    } 
    catch (err) {
      setError(err.message);
      notifications.show({
        title: t('users:notifications.loadError'),
        message: err.message,
        color: 'red',
      });
    } 
    finally {
      setLoading(false);
    }
  }, [t]);

  const loadUserById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const user = await userService.getUserById(id);
      setCurrentUser(user);
      return user;
    } 
    catch (err) {
      setError(err.message);
      setCurrentUser(null);
      notifications.show({
        title: t('users:notifications.loadError'),
        message: err.message,
        color: 'red',
      });
      throw err;
    } 
    finally {
      setLoading(false);
    }
  }, [t]);

  const createUser = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const newUser = await userService.createUser(userData);
      setUsers(prev => [...prev, newUser]);
      notifications.show({
        title: t('common:app.success'),
        message: t('users:notifications.createSuccess'),
        color: 'green',
      });
      return newUser;
    } 
    catch (err) {
      setError(err.message);
      notifications.show({
        title: t('users:notifications.createError'),
        message: err.message,
        color: 'red',
      });
      throw err;
    } 
    finally {
      setLoading(false);
    }
  };

  const updateUser = async (id, userData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedUser = await userService.updateUser(id, userData);
      setUsers(prev => prev.map(user => user.id === id ? updatedUser : user));
      setCurrentUser(updatedUser);
      notifications.show({
        title: t('common:app.success'),
        message: t('users:notifications.updateSuccess'),
        color: 'green',
      });
      return updatedUser;
    } 
    catch (err) {
      setError(err.message);
      notifications.show({
        title: t('users:notifications.updateError'),
        message: err.message,
        color: 'red',
      });
      throw err;
    } 
    finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await userService.deleteUser(id);
      setUsers(prev => prev.filter(user => user.id !== id));
      if (currentUser && currentUser.id === id) setCurrentUser(null);
      notifications.show({
        title: t('common:app.success'),
        message: t('users:notifications.deleteSuccess'),
        color: 'green',
      });
    } 
    catch (err) {
      setError(err.message);
      notifications.show({
        title: t('users:notifications.deleteError'),
        message: err.message,
        color: 'red',
      });
      throw err;
    } 
    finally {
      setLoading(false);
    }
  };

  const setUserRoles = async (userId, roleIds) => {
    setLoading(true);
    setError(null);
    try {
      const updatedUser = await userService.setUserRoles(userId, roleIds);
      setUsers(prev => prev.map(user => user.id === userId ? updatedUser : user));
      if (currentUser && currentUser.id === userId) setCurrentUser(updatedUser);
      notifications.show({
        title: t('common:app.success'),
        message: t('users:notifications.rolesUpdateSuccess'),
        color: 'green',
      });
      return updatedUser;
    } 
    catch (err) {
      setError(err.message);
      notifications.show({
        title: t('users:notifications.rolesUpdateError'),
        message: err.message,
        color: 'red',
      });
      throw err;
    } 
    finally {
      setLoading(false);
    }
  };


  const clearCurrentUser = () => setCurrentUser(null);
  const clearError = () => setError(null);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);
  

  return {
    users,
    currentUser,
    loading,
    error,
    loadUsers,
    loadUserById,
    createUser,
    updateUser,
    deleteUser,
    setUserRoles,
    clearCurrentUser,
    clearError,
  };
};
