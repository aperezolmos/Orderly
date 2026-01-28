import { useState, useMemo } from 'react';


export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];


export const usePagination = (data = [], initialPageSize = DEFAULT_PAGE_SIZE) => {
  
  const [activePage, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  
  const totalPages = Math.ceil(data.length / pageSize) || 1;

  if (activePage > totalPages && totalPages > 0) {
    setPage(totalPages);
  }

  
  const paginatedData = useMemo(() => {
    const start = (activePage - 1) * pageSize;
    const end = start + pageSize;
    return data.slice(start, end);
  }, [data, activePage, pageSize]);


  return {
    activePage,
    setPage,
    pageSize,
    setPageSize,
    totalPages,
    paginatedData,
    totalItems: data.length
  };
};
