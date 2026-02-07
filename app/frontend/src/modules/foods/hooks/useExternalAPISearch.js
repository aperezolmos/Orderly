import { useState, useCallback } from 'react';
import { notifications } from '@mantine/notifications';
import { foodService } from '../../../services/backend/foodService';
import { useTranslation } from 'react-i18next';


export function useExternalAPISearch() {
  
  const { t } = useTranslation(['foods', 'common']);
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastQuery, setLastQuery] = useState('');
  const [searched, setSearched] = useState(false);
  const [creating, setCreating] = useState(false);


  const search = useCallback(async (query, page = 1) => {
    
    setLoading(true);
    setError(null);
    setSearched(true);
    
    try {
      const res = await foodService.searchFoodFromExternalAPI(query, page);
      setResults(res.products || []);
      setPage(page);
      setPageCount(res.page_count);
      setLastQuery(query);
    } 
    catch (err) {
      setError(err.message || t('foods:off.error'));
      setResults([]);
      notifications.show({
        title: t('foods:off.errorTitle'),
        message: err.message || t('foods:off.error'),
        color: 'red',
      });
    } 
    finally {
      setLoading(false);
    }
  }, [t]);

  // Changing pages repeats the last search
  const handleSetPage = (p) => {
    setPage(p);
    if (lastQuery) search(lastQuery, p);
  };

  
  const createFoodFromExternalAPIBarcode = async (barcode) => {
    
    setCreating(true);
    
    try {
      await foodService.createFoodFromExternalAPIBarcode(barcode);
      notifications.show({
        title: t('common:app.success'),
        message: t('foods:notifications.createSuccess'),
        color: 'green',
      });
    } 
    catch (err) {
      notifications.show({
        title: t('foods:notifications.createError'),
        message: err.message,
        color: 'red',
      });
      throw err;
    } 
    finally {
      setCreating(false);
    }
  };


  return {
    results,
    loading,
    error,
    page,
    pageCount,
    search,
    setPage: handleSetPage,
    searched,
    creating,
    createFoodFromExternalAPIBarcode,
  };
}
