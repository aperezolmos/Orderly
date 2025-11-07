/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback } from 'react';
import { roleService } from '../../../services/backend/roleService';


export const useUserRoles = (initialUserRoles = []) => {
  
  const [availableRoles, setAvailableRoles] = useState([]);
  const [assignedRoles, setAssignedRoles] = useState([]);
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
    const uniqueAssignedRoles = initialUserRoles.reduce((acc, role) => {
      if (!acc.some(r => r.id === role.id)) {
        acc.push(role);
      }
      return acc;
    }, []);
    
    setAssignedRoles(uniqueAssignedRoles);
  }, [JSON.stringify(initialUserRoles)]);

  useEffect(() => {
    loadAllRoles();
  }, [loadAllRoles]);
  

  // Add a role to the user
  const addRole = (role) => {
    if (!assignedRoles.some(r => r.id === role.id)) {
      setAssignedRoles(prev => [...prev, role]);
    }
  };

  // Remove a role from the user
  const removeRole = (roleId) => {
    setAssignedRoles(prev => prev.filter(role => role.id !== roleId));
  };

  // Get available roles (all roles - assigned)
  const getAvailableRoles = useCallback(() => {
    return availableRoles.filter(availableRole => 
      !assignedRoles.some(assignedRole => assignedRole.id === availableRole.id)
    );
  }, [availableRoles, assignedRoles]);


  return {
    assignedRoles,
    availableRoles: getAvailableRoles(),
    loading,
    addRole,
    removeRole,
    getAssignedRoleIds: () => assignedRoles.map(role => role.id),
    resetRoles: () => setAssignedRoles(initialUserRoles),
    hasChanges: JSON.stringify(assignedRoles) !== JSON.stringify(initialUserRoles)
  };
};
