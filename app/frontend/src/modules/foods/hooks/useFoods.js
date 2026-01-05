import { useState, useEffect, useCallback } from 'react';
import { foodService } from '../../../services/backend/foodService';
import { notifications } from '@mantine/notifications';
import { useTranslation } from 'react-i18next';


export const useFoods = () => {
  
  const [foods, setFoods] = useState([]);
  const [currentFood, setCurrentFood] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { t } = useTranslation(['common', 'foods']);


  const loadFoods = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
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
  }, [t]);

  const loadFoodById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const food = await foodService.getFoodById(id);
      setCurrentFood(food);
      return food;
    } 
    catch (err) {
      setError(err.message);
      setCurrentFood(null);
      notifications.show({
        title: t('foods:notifications.loadError'),
        message: err.message,
        color: 'red',
      });
      throw err;
    } 
    finally {
      setLoading(false);
    }
  }, [t]);

  const createFood = async (foodData) => {
    setLoading(true);
    setError(null);
    try {
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
      setError(err.message);
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
    setLoading(true);
    setError(null);
    try {
      const updatedFood = await foodService.updateFood(id, foodData);
      setFoods(prev => prev.map(food => food.id === id ? updatedFood : food));
      setCurrentFood(updatedFood);
      notifications.show({
        title: t('common:app.success'),
        message: t('foods:notifications.updateSuccess'),
        color: 'green',
      });
      return updatedFood;
    } 
    catch (err) {
      setError(err.message);
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
    setLoading(true);
    setError(null);
    try {
      await foodService.deleteFood(id);
      setFoods(prev => prev.filter(food => food.id !== id));
      if (currentFood && currentFood.id === id) setCurrentFood(null);
      notifications.show({
        title: t('common:app.success'),
        message: t('foods:notifications.deleteSuccess'),
        color: 'green',
      });
    } 
    catch (err) {
      setError(err.message);
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


  const clearCurrentFood = () => setCurrentFood(null);
  const clearError = () => setError(null);

  useEffect(() => {
    loadFoods();
  }, [loadFoods]);


  return {
    foods,
    currentFood,
    loading,
    error,
    loadFoods,
    loadFoodById,
    createFood,
    updateFood,
    deleteFood,
    clearCurrentFood,
    clearError,
  };
};
