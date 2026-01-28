import { apiClient } from './api';


export const reservationService = {

  getReservations: async () => apiClient.get('/reservations'),
  getReservationById: async (id) => apiClient.get(`/reservations/${id}`),
  createReservation: async (reservationData) => apiClient.post('/reservations', reservationData),
  updateReservation: async (id, reservationData) => apiClient.put(`/reservations/${id}`, reservationData),
  deleteReservation: async (id) => apiClient.delete(`/reservations/${id}`),
  updateReservationStatus: async (id, status) => apiClient.patch(`/reservations/${id}/status?status=${status}`),
};
