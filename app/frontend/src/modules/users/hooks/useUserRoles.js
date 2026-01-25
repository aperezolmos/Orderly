import { useState, useEffect, useCallback, useMemo } from 'react';
import { roleService } from '../../../services/backend/roleService';


export const useUserRoles = (initialIds = []) => {
  
  const [allRoles, setAllRoles] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [loading, setLoading] = useState(false);

  
  const loadAllRoles = useCallback(async () => {
    try {
      setLoading(true);
      const roles = await roleService.getRoles();
      setAllRoles(roles);
    } 
    catch (err) {
      console.error('Error loading roles:', err);
    } 
    finally {
      setLoading(false);
    }
  }, []);

  
  useEffect(() => {
    const ids = new Set(initialIds.map(id => parseInt(id, 10)));
    setSelectedIds(ids);
  }, [JSON.stringify(initialIds)]); // stringify used to detect changes in the array

  useEffect(() => {
    loadAllRoles();
  }, [loadAllRoles]);

  
  const addRole = (role) => {
    const newSet = new Set(selectedIds);
    newSet.add(role.id);
    setSelectedIds(newSet);
  };

  const removeRole = (roleId) => {
    const newSet = new Set(selectedIds);
    newSet.delete(roleId);
    setSelectedIds(newSet);
  };


  const assignedRoles = useMemo(() => 
    allRoles.filter(role => selectedIds.has(role.id)), 
  [allRoles, selectedIds]);

  const availableRoles = useMemo(() => 
    allRoles.filter(role => !selectedIds.has(role.id)), 
  [allRoles, selectedIds]);


  return {
    assignedRoles,
    availableRoles,
    loading,
    addRole,
    removeRole,
    getAssignedRoleIds: () => Array.from(selectedIds),
    hasChanges: (() => {
      // Simple comparison of sets
      if (selectedIds.size !== initialIds.length) return true;
      const initialSet = new Set(initialIds.map(id => parseInt(id, 10)));
      for (let id of selectedIds) if (!initialSet.has(id)) return true;
      return false;
    })()
  };
};