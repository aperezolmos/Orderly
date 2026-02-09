import { useState, useEffect } from 'react';
import { foodService } from '../../../services/backend/foodService';


export const useIngredientSearch = () => {
  
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {

    if (search.trim().length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      setLoading(true);
      setError(null);
      
      foodService.searchFoods(search)
        .then((data) => {
          setResults(data || []);
        })
        .catch((err) => {
          console.error("Error searching foods:", err);
          setError(err.message);
          setResults([]);
        })
        .finally(() => setLoading(false));
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const clearSearch = () => {
    setSearch('');
    setResults([]);
  };


  return {
    search,
    setSearch,
    results,
    loading,
    error,
    clearSearch
  };
};
