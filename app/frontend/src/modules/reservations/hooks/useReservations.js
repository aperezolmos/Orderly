import { useState, useEffect, useCallback } from 'react';
import { reservationService } from '../../../services/backend/reservationService';
import { notifications } from '@mantine/notifications';
import { useTranslation } from 'react-i18next';


export const useReservations = () => {
  
  const [reservations, setReservations] = useState([]);
  const [currentReservation, setCurrentReservation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { t } = useTranslation(['common', 'reservations']);


  const loadReservations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
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
  }, [t]);

  const loadReservationById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const reservation = await reservationService.getReservationById(id);
      setCurrentReservation(reservation);
      return reservation;
    } 
    catch (err) {
      setError(err.message);
      setCurrentReservation(null);
      notifications.show({
        title: t('reservations:notifications.loadError'),
        message: err.message,
        color: 'red',
      });
      throw err;
    } 
    finally {
      setLoading(false);
    }
  }, [t]);

  const createReservation = async (reservationData) => {
    setLoading(true);
    setError(null);
    try {
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
      setError(err.message);
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
    setLoading(true);
    setError(null);
    try {
      const updated = await reservationService.updateReservation(id, reservationData);
      setReservations(prev => prev.map(r => r.id === id ? updated : r));
      setCurrentReservation(updated);
      notifications.show({
        title: t('common:app.success'),
        message: t('reservations:notifications.updateSuccess'),
        color: 'green',
      });
      return updated;
    } 
    catch (err) {
      setError(err.message);
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
    setLoading(true);
    setError(null);
    try {
      await reservationService.deleteReservation(id);
      setReservations(prev => prev.filter(r => r.id !== id));
      if (currentReservation && currentReservation.id === id) setCurrentReservation(null);
      notifications.show({
        title: t('common:app.success'),
        message: t('reservations:notifications.deleteSuccess'),
        color: 'green',
      });
    } 
    catch (err) {
      setError(err.message);
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


  const clearCurrentReservation = () => setCurrentReservation(null);
  const clearError = () => setError(null);

  useEffect(() => {
    loadReservations();
  }, [loadReservations]);
  

  return {
    reservations,
    currentReservation,
    loading,
    error,
    loadReservations,
    loadReservationById,
    createReservation,
    updateReservation,
    deleteReservation,
    clearCurrentReservation,
    clearError,
  };
};
