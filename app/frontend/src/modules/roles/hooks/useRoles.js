import { useState, useEffect, useCallback } from 'react';
import { roleService } from '../../../services/backend/roleService';
import { notifications } from '@mantine/notifications';
import { useTranslation } from 'react-i18next';


export const useRoles = () => {
  
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { t } = useTranslation(['common', 'roles']);
  

  const loadRoles = useCallback(async () => {
    if (loading) return;
    
    try {
      setLoading(true);
      setError(null);
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
  }, []);

  useEffect(() => {
    loadRoles();
  }, []);
  

  const createRole = async (roleData) => {
    try {
      setLoading(true);
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
    try {
      setLoading(true);
      const updatedRole = await roleService.updateRole(id, roleData);
      setRoles(prev => prev.map(role => 
        role.id === id ? updatedRole : role
      ));
      notifications.show({
        title: t('common:app.success'),
        message: t('roles:notifications.updateSuccess'),
        color: 'green',
      });
      return updatedRole;
    } 
    catch (err) {
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
    try {
      setLoading(true);
      await roleService.deleteRole(id);
      setRoles(prev => prev.filter(role => role.id !== id));
      notifications.show({
        title: t('common:app.success'),
        message: t('roles:notifications.deleteSuccess'),
        color: 'green',
      });
    } 
    catch (err) {
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


  return {
    roles,
    loading,
    error,
    loadRoles,
    createRole,
    updateRole,
    deleteRole,
  };
};
