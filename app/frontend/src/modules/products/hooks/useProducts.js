import { useState, useEffect, useCallback } from 'react';
import { productService } from '../../../services/backend/productService';
import { notifications } from '@mantine/notifications';
import { useTranslation } from 'react-i18next';


export const useProducts = () => {
  
  const [products, setProducts] = useState([]);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { t } = useTranslation(['common', 'products']);


  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productService.getProducts();
      setProducts(data);
    } 
    catch (err) {
      setError(err.message);
      notifications.show({
        title: t('products:notifications.loadError'),
        message: err.message,
        color: 'red',
      });
    } 
    finally {
      setLoading(false);
    }
  }, [t]);

  const loadProductById = useCallback(async (id, opts = {}) => {
    setLoading(true);
    setError(null);
    try {
      const product = await productService.getProductById(id, opts);
      setCurrentProduct(product);
      return product;
    } 
    catch (err) {
      setError(err.message);
      setCurrentProduct(null);
      notifications.show({
        title: t('products:notifications.loadError'),
        message: err.message,
        color: 'red',
      });
      throw err;
    } 
    finally {
      setLoading(false);
    }
  }, [t]);

  const createProduct = async (productData) => {
    setLoading(true);
    setError(null);
    try {
      const newProduct = await productService.createProduct(productData);
      setProducts(prev => [...prev, newProduct]);
      notifications.show({
        title: t('common:app.success'),
        message: t('products:notifications.createSuccess'),
        color: 'green',
      });
      return newProduct;
    } 
    catch (err) {
      setError(err.message);
      notifications.show({
        title: t('products:notifications.createError'),
        message: err.message,
        color: 'red',
      });
      throw err;
    } 
    finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id, productData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedProduct = await productService.updateProduct(id, productData);
      setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p));
      setCurrentProduct(updatedProduct);
      notifications.show({
        title: t('common:app.success'),
        message: t('products:notifications.updateSuccess'),
        color: 'green',
      });
      return updatedProduct;
    } 
    catch (err) {
      setError(err.message);
      notifications.show({
        title: t('products:notifications.updateError'),
        message: err.message,
        color: 'red',
      });
      throw err;
    } 
    finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await productService.deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      if (currentProduct && currentProduct.id === id) setCurrentProduct(null);
      notifications.show({
        title: t('common:app.success'),
        message: t('products:notifications.deleteSuccess'),
        color: 'green',
      });
    } 
    catch (err) {
      setError(err.message);
      notifications.show({
        title: t('products:notifications.deleteError'),
        message: err.message,
        color: 'red',
      });
      throw err;
    } 
    finally {
      setLoading(false);
    }
  };


  const clearCurrentProduct = () => setCurrentProduct(null);
  const clearError = () => setError(null);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);
  

  return {
    products,
    currentProduct,
    loading,
    error,
    loadProducts,
    loadProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    clearCurrentProduct,
    clearError,
  };
};
