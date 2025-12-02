import { useState, useEffect } from 'react';
import { foodService } from '../../../services/backend/foodService';
import { notifications } from '@mantine/notifications';
import { useTranslationWithLoading } from '../../../common/hooks/useTranslationWithLoading';


export const useFoods = () => {
  
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { t } = useTranslationWithLoading(['common', 'foods']);


  const loadFoods = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await foodService.getFoods();
      setFoods(data);
    } 
    catch (err) {
      setError(err.message);
      notifications.show({
        title: t('foods:notifications.loadError'),
        message: err.message,
        color: 'red',
      });
    } 
    finally {
      setLoading(false);
    }
  };

  const createFood = async (foodData) => {
    try {
      setLoading(true);
      const newFood = await foodService.createFood(foodData);
      setFoods(prev => [...prev, newFood]);
      notifications.show({
        title: t('common:app.success'),
        message: t('foods:notifications.createSuccess'),
        color: 'green',
      });
      return newFood;
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
      setLoading(false);
    }
  };

  const updateFood = async (id, foodData) => {
    try {
      setLoading(true);
      const updatedFood = await foodService.updateFood(id, foodData);
      setFoods(prev => prev.map(food => food.id === id ? updatedFood : food));
      notifications.show({
        title: t('common:app.success'),
        message: t('foods:notifications.updateSuccess'),
        color: 'green',
      });
      return updatedFood;
    } 
    catch (err) {
      notifications.show({
        title: t('foods:notifications.updateError'),
        message: err.message,
        color: 'red',
      });
      throw err;
    } 
    finally {
      setLoading(false);
    }
  };

  const deleteFood = async (id) => {
    try {
      setLoading(true);
      await foodService.deleteFood(id);
      setFoods(prev => prev.filter(food => food.id !== id));
      notifications.show({
        title: t('common:app.success'),
        message: t('foods:notifications.deleteSuccess'),
        color: 'green',
      });
    } 
    catch (err) {
      notifications.show({
        title: t('foods:notifications.deleteError'),
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
    loadFoods();
  }, []);
  

  return {
    foods,
    loading,
    error,
    loadFoods,
    createFood,
    updateFood,
    deleteFood,
  };
};
