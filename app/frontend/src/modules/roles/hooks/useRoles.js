/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback } from 'react';
import { roleService } from '../../../services/backend/roleService';
import { notifications } from '@mantine/notifications';


export const useRoles = () => {
  
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  

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
        title: 'Error loading roles',
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
        title: 'Success',
        message: 'Role created successfully',
        color: 'green',
      });
      return newRole;
    } 
    catch (err) {
      notifications.show({
        title: 'Error creating role',
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
        title: 'Success',
        message: 'Role updated successfully',
        color: 'green',
      });
      return updatedRole;
    } 
    catch (err) {
      notifications.show({
        title: 'Error updating role',
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
        title: 'Success',
        message: 'Role deleted successfully',
        color: 'green',
      });
    } 
    catch (err) {
      notifications.show({
        title: 'Error deleting role',
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
