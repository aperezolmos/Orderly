import { useState, useEffect } from 'react';
import { userService } from '../../../services/backend/userService';
import { notifications } from '@mantine/notifications';
import { useTranslationWithLoading } from '../../../common/hooks/useTranslationWithLoading';


export const useUsers = () => {
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { t } = useTranslationWithLoading(['common', 'users']);
  

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
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
  };

  const createUser = async (userData) => {
    try {
      setLoading(true);
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
    try {
      setLoading(true);
      const updatedUser = await userService.updateUser(id, userData);
      setUsers(prev => prev.map(user => 
        user.id === id ? updatedUser : user
      ));
      notifications.show({
        title: t('common:app.success'),
        message: t('users:notifications.updateSuccess'),
        color: 'green',
      });
      return updatedUser;
    } 
    catch (err) {
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
    try {
      setLoading(true);
      await userService.deleteUser(id);
      setUsers(prev => prev.filter(user => user.id !== id));
      notifications.show({
        title: t('common:app.success'),
        message: t('users:notifications.deleteSuccess'),
        color: 'green',
      });
    } 
    catch (err) {
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
    try {
      setLoading(true);
      const updatedUser = await userService.setUserRoles(userId, roleIds);
      setUsers(prev => prev.map(user => 
        user.id === userId ? updatedUser : user
      ));
      notifications.show({
        title: t('common:app.success'),
        message: t('users:notifications.rolesUpdateSuccess'),
        color: 'green',
      });
      return updatedUser;
    } 
    catch (err) {
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


  useEffect(() => {
    loadUsers();
  }, []);


  return {
    users,
    loading,
    error,
    loadUsers,
    createUser,
    updateUser,
    deleteUser,
    setUserRoles,
  };
};
