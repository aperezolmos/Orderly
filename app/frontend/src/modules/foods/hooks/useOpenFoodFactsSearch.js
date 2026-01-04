import { useState, useCallback } from 'react';
import { notifications } from '@mantine/notifications';
import { openFoodFactsService } from '../../../services/external/openFoodFactsService';
import { useTranslation } from 'react-i18next';


const PAGE_SIZE = 15;


export function useOpenFoodFactsSearch() {
  
  const { t } = useTranslation(['foods']);
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastQuery, setLastQuery] = useState('');
  const [searched, setSearched] = useState(false);


  const search = useCallback(async (query, pageNum = 1) => {
    
    setLoading(true);
    setError(null);
    setSearched(true);
    
    try {
      const res = await openFoodFactsService.searchProducts(query, pageNum, PAGE_SIZE);
      setResults(res.products || []);
      setPage(pageNum);
      setPageCount(Math.ceil((res.count || 0) / PAGE_SIZE));
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

  // Cambiar de página repite la última búsqueda
  const handleSetPage = (p) => {
    setPage(p);
    if (lastQuery) search(lastQuery, p);
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
  };
}
