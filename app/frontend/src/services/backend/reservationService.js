import { apiClient } from './api';


export const reservationService = {

  getReservations: async () => apiClient.get('/reservations'),
  getReservationById: async (id) => apiClient.get(`/reservations/${id}`),
  createReservation: async (reservationData) => apiClient.post('/reservations', reservationData),
  updateReservation: async (id, reservationData) => apiClient.put(`/reservations/${id}`, reservationData),
  deleteReservation: async (id) => apiClient.delete(`/reservations/${id}`),
  getActiveTables: async () => apiClient.get('/tables/active'), //TODO: trasladar
};
