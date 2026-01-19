import { useState, useCallback } from 'react';
import { notifications } from '@mantine/notifications';
import { useTranslation } from 'react-i18next';
import { roleService } from '../../../services/backend/roleService';


export const useRoles = () => {
  
  const [roles, setRoles] = useState([]);
  const [currentRole, setCurrentRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { t } = useTranslation(['common', 'roles']);
  

  const loadRoles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await roleService.getRoles();
      setRoles(data);
    } 
    catch (err) {
      setError(err.message);
      notifications.show({
        title: t('roles:notifications.loadError'),
        message: err.message,
        color: 'red',
      });
    } 
    finally {
      setLoading(false);
    }
  }, [t]);

  const loadRoleById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const role = await roleService.getRoleById(id);
      setCurrentRole(role);
      return role;
    } 
    catch (err) {
      setError(err.message);
      setCurrentRole(null);
      notifications.show({
        title: t('roles:notifications.loadError'),
        message: err.message,
        color: 'red',
      });
      throw err;
    } 
    finally {
      setLoading(false);
    }
  }, [t]);

  const createRole = async (roleData) => {
    setLoading(true);
    setError(null);
    try {
      const newRole = await roleService.createRole(roleData);
      setRoles(prev => [...prev, newRole]);
      notifications.show({
        title: t('common:app.success'),
        message: t('roles:notifications.createSuccess'),
        color: 'green',
      });
      return newRole;
    } 
    catch (err) {
      setError(err.message);
      notifications.show({
        title: t('roles:notifications.createError'),
        message: err.message,
        color: 'red',
      });
      throw err;
    } 
    finally {
      setLoading(false);
    }
  };

  const updateRole = async (id, roleData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedRole = await roleService.updateRole(id, roleData);
      setRoles(prev => prev.map(role => role.id === id ? updatedRole : role));
      setCurrentRole(updatedRole);
      notifications.show({
        title: t('common:app.success'),
        message: t('roles:notifications.updateSuccess'),
        color: 'green',
      });
      return updatedRole;
    } 
    catch (err) {
      setError(err.message);
      notifications.show({
        title: t('roles:notifications.updateError'),
        message: err.message,
        color: 'red',
      });
      throw err;
    } 
    finally {
      setLoading(false);
    }
  };

  const deleteRole = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await roleService.deleteRole(id);
      setRoles(prev => prev.filter(role => role.id !== id));
      if (currentRole && currentRole.id === id) setCurrentRole(null);
      notifications.show({
        title: t('common:app.success'),
        message: t('roles:notifications.deleteSuccess'),
        color: 'green',
      });
    } 
    catch (err) {
      setError(err.message);
      notifications.show({
        title: t('roles:notifications.deleteError'),
        message: err.message,
        color: 'red',
      });
      throw err;
    } 
    finally {
      setLoading(false);
    }
  };


  const clearCurrentRole = () => setCurrentRole(null);
  const clearError = () => setError(null);


  return {
    roles,
    currentRole,
    loading,
    error,
    loadRoles,
    loadRoleById,
    createRole,
    updateRole,
    deleteRole,
    clearCurrentRole,
    clearError,
  };
};
