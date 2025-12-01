import { useState, useEffect } from 'react';
import { reservationService } from '../../../services/backend/reservationService';
import { notifications } from '@mantine/notifications';
import { useTranslationWithLoading } from '../../../common/hooks/useTranslationWithLoading';


export const useReservations = () => {
  
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { t } = useTranslationWithLoading(['common', 'reservations']);


  const loadReservations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await reservationService.getReservations();
      setReservations(data);
    } 
    catch (err) {
      setError(err.message);
      notifications.show({
        title: t('reservations:notifications.loadError'),
        message: err.message,
        color: 'red',
      });
    } 
    finally {
      setLoading(false);
    }
  };

  const createReservation = async (reservationData) => {
    try {
      setLoading(true);
      const newReservation = await reservationService.createReservation(reservationData);
      setReservations(prev => [...prev, newReservation]);
      notifications.show({
        title: t('common:app.success'),
        message: t('reservations:notifications.createSuccess'),
        color: 'green',
      });
      return newReservation;
    } 
    catch (err) {
      notifications.show({
        title: t('reservations:notifications.createError'),
        message: err.message,
        color: 'red',
      });
      throw err;
    } 
    finally {
      setLoading(false);
    }
  };

  const updateReservation = async (id, reservationData) => {
    try {
      setLoading(true);
      const updated = await reservationService.updateReservation(id, reservationData);
      setReservations(prev => prev.map(r => r.id === id ? updated : r));
      notifications.show({
        title: t('common:app.success'),
        message: t('reservations:notifications.updateSuccess'),
        color: 'green',
      });
      return updated;
    } 
    catch (err) {
      notifications.show({
        title: t('reservations:notifications.updateError'),
        message: err.message,
        color: 'red',
      });
      throw err;
    } 
    finally {
      setLoading(false);
    }
  };

  const deleteReservation = async (id) => {
    try {
      setLoading(true);
      await reservationService.deleteReservation(id);
      setReservations(prev => prev.filter(r => r.id !== id));
      notifications.show({
        title: t('common:app.success'),
        message: t('reservations:notifications.deleteSuccess'),
        color: 'green',
      });
    } 
    catch (err) {
      notifications.show({
        title: t('reservations:notifications.deleteError'),
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
    loadReservations();
  }, []);
  

  return {
    reservations,
    loading,
    error,
    loadReservations,
    createReservation,
    updateReservation,
    deleteReservation,
  };
};
