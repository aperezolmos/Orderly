import { useState, useEffect } from 'react';
import { diningTableService } from '../../../services/backend/diningTableService';
import { notifications } from '@mantine/notifications';
import { useTranslationWithLoading } from '../../../common/hooks/useTranslationWithLoading';


export const useDiningTables = () => {
  
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { t } = useTranslationWithLoading(['common', 'diningTables']);


  const loadTables = async () => {
    try {
      setLoading(true);
      setError(null);
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
  };

  const createTable = async (tableData) => {
    try {
      setLoading(true);
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
    try {
      setLoading(true);
      const updatedTable = await diningTableService.updateTable(id, tableData);
      setTables(prev => prev.map(table =>
        table.id === id ? updatedTable : table
      ));
      notifications.show({
        title: t('common:app.success'),
        message: t('diningTables:notifications.updateSuccess'),
        color: 'green',
      });
      return updatedTable;
    } 
    catch (err) {
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
    try {
      setLoading(true);
      await diningTableService.deleteTable(id);
      setTables(prev => prev.filter(table => table.id !== id));
      notifications.show({
        title: t('common:app.success'),
        message: t('diningTables:notifications.deleteSuccess'),
        color: 'green',
      });
    } 
    catch (err) {
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

  useEffect(() => {
    loadTables();
  }, []);


  return {
    tables,
    loading,
    error,
    loadTables,
    createTable,
    updateTable,
    deleteTable,
  };
};
