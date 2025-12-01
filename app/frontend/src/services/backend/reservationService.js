import { apiClient, handleApiError } from './api';


export const reservationService = {
  
  getReservations: async () => {
    try {
      return await apiClient.get('/reservations');
    } 
    catch (error) {
      return handleApiError(error);
    }
  },

  getReservationById: async (id) => {
    try {
      return await apiClient.get(`/reservations/${id}`);
    } 
    catch (error) {
      return handleApiError(error);
    }
  },

  createReservation: async (reservationData) => {
    try {
      return await apiClient.post('/reservations', reservationData);
    } 
    catch (error) {
      return handleApiError(error);
    }
  },

  updateReservation: async (id, reservationData) => {
    try {
      return await apiClient.put(`/reservations/${id}`, reservationData);
    } 
    catch (error) {
      return handleApiError(error);
    }
  },

  deleteReservation: async (id) => {
    try {
      return await apiClient.delete(`/reservations/${id}`);
    } 
    catch (error) {
      return handleApiError(error);
    }
  },

  getActiveTables: async () => { //TODO: trasladar
    try {
      return await apiClient.get('/tables/active');
    } 
    catch (error) {
      return handleApiError(error);
    }
  }
};
