import { useState, useCallback } from 'react';
import { notifications } from '@mantine/notifications';
import { useTranslation } from 'react-i18next';
import { diningTableService } from '../../../services/backend/diningTableService';


export const useDiningTables = () => {
  
  const [tables, setTables] = useState([]);
  const [currentTable, setCurrentTable] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { t } = useTranslation(['common', 'diningTables']);


  const loadTables = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await diningTableService.getTables();
      setTables(data);
    } 
    catch (err) {
      setError(err.message);
      notifications.show({
        title: t('diningTables:notifications.loadError'),
        message: err.message,
        color: 'red',
      });
    } 
    finally {
      setLoading(false);
    }
  }, [t]);

  const loadTableById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const table = await diningTableService.getTableById(id);
      setCurrentTable(table);
      return table;
    } 
    catch (err) {
      setError(err.message);
      setCurrentTable(null);
      notifications.show({
        title: t('diningTables:notifications.loadError'),
        message: err.message,
        color: 'red',
      });
      throw err;
    } 
    finally {
      setLoading(false);
    }
  }, [t]);

  const createTable = async (tableData) => {
    setLoading(true);
    setError(null);
    try {
      const newTable = await diningTableService.createTable(tableData);
      setTables(prev => [...prev, newTable]);
      notifications.show({
        title: t('common:app.success'),
        message: t('diningTables:notifications.createSuccess'),
        color: 'green',
      });
      return newTable;
    } 
    catch (err) {
      setError(err.message);
      notifications.show({
        title: t('diningTables:notifications.createError'),
        message: err.message,
        color: 'red',
      });
      throw err;
    } 
    finally {
      setLoading(false);
    }
  };

  const updateTable = async (id, tableData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedTable = await diningTableService.updateTable(id, tableData);
      setTables(prev => prev.map(table => table.id === id ? updatedTable : table));
      setCurrentTable(updatedTable);
      notifications.show({
        title: t('common:app.success'),
        message: t('diningTables:notifications.updateSuccess'),
        color: 'green',
      });
      return updatedTable;
    } 
    catch (err) {
      setError(err.message);
      notifications.show({
        title: t('diningTables:notifications.updateError'),
        message: err.message,
        color: 'red',
      });
      throw err;
    } 
    finally {
      setLoading(false);
    }
  };

  const deleteTable = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await diningTableService.deleteTable(id);
      setTables(prev => prev.filter(table => table.id !== id));
      if (currentTable && currentTable.id === id) setCurrentTable(null);
      notifications.show({
        title: t('common:app.success'),
        message: t('diningTables:notifications.deleteSuccess'),
        color: 'green',
      });
    } 
    catch (err) {
      setError(err.message);
      notifications.show({
        title: t('diningTables:notifications.deleteError'),
        message: err.message,
        color: 'red',
      });
      throw err;
    } 
    finally {
      setLoading(false);
    }
  };
  

  const clearCurrentTable = () => setCurrentTable(null);
  const clearError = () => setError(null);


  return {
    tables,
    currentTable,
    loading,
    error,
    loadTables,
    loadTableById,
    createTable,
    updateTable,
    deleteTable,
    clearCurrentTable,
    clearError,
  };
};
