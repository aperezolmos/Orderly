import { useState, useEffect } from 'react';
import { productService } from '../../../services/backend/productService';
import { notifications } from '@mantine/notifications';
import { useTranslationWithLoading } from '../../../common/hooks/useTranslationWithLoading';


export const useProducts = () => {
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { t } = useTranslationWithLoading(['common', 'products']);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
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
  };

  const createProduct = async (productData) => {
    try {
      setLoading(true);
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
    try {
      setLoading(true);
      const updatedProduct = await productService.updateProduct(id, productData);
      setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p));
      notifications.show({
        title: t('common:app.success'),
        message: t('products:notifications.updateSuccess'),
        color: 'green',
      });
      return updatedProduct;
    } 
    catch (err) {
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
    try {
      setLoading(true);
      await productService.deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      notifications.show({
        title: t('common:app.success'),
        message: t('products:notifications.deleteSuccess'),
        color: 'green',
      });
    } 
    catch (err) {
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

  useEffect(() => {
    loadProducts();
  }, []);


  return {
    products,
    loading,
    error,
    loadProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  };
};
