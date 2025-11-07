/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback } from 'react';
import { roleService } from '../../../services/backend/roleService';


export const useUserRoles = (initialUserRoles = []) => {
  
  const [availableRoles, setAvailableRoles] = useState([]);
  const [assignedRoles, setAssignedRoles] = useState(initialUserRoles);
  const [loading, setLoading] = useState(false);
  

  // Load all roles from backend
  const loadAllRoles = useCallback(async () => {
    if (loading) return;
    
    try {
      setLoading(true);
      const allRoles = await roleService.getRoles();
      setAvailableRoles(allRoles);
    } 
    catch (error) {
      console.error('Error loading roles:', error);
    } 
    finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllRoles();
  }, []);

  useEffect(() => {
    setAssignedRoles(initialUserRoles);
  }, [JSON.stringify(initialUserRoles)]);
  

  // Add a role to the user
  const addRole = (role) => {
    if (!assignedRoles.find(r => r.id === role.id)) {
      setAssignedRoles(prev => [...prev, role]);
    }
  };

  // Remove a role from the user
  const removeRole = (roleId) => {
    setAssignedRoles(prev => prev.filter(role => role.id !== roleId));
  };

  // Get available roles (all roles - assigned)
  const getAvailableRoles = () => {
    return availableRoles.filter(availableRole => 
      !assignedRoles.find(assignedRole => assignedRole.id === availableRole.id)
    );
  };

  // Get IDs of assigned roles (send to backend)
  const getAssignedRoleIds = () => {
    return assignedRoles.map(role => role.id);
  };

  // Reset to initial roles
  const resetRoles = () => {
    setAssignedRoles(initialUserRoles);
  };


  return {
    assignedRoles,
    availableRoles: getAvailableRoles(),
    loading,
    addRole,
    removeRole,
    getAssignedRoleIds,
    resetRoles,
    hasChanges: JSON.stringify(assignedRoles) !== JSON.stringify(initialUserRoles)
  };
};
