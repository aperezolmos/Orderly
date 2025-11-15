package es.ubu.inf.tfg.reservation;

import es.ubu.inf.tfg.reservation.details.ReservationStatus;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Integer> {
    List<Reservation> findByDiningTableId(Integer diningTableId);
    List<Reservation> findByStatus(ReservationStatus status);
    List<Reservation> findByReservationDetailsReservationDateTimeBetween(
        LocalDateTime start, LocalDateTime end);
    
    // Detect scheduling conflicts (avoid double bookings)
    @Query("SELECT r FROM Reservation r WHERE r.diningTable.id = :tableId " +
           "AND r.status IN ('CONFIRMED', 'SEATED') " +  // Only active reservations
           "AND r.reservationDetails.reservationDateTime < :endTime " +
           "AND FUNCTION('TIMESTAMPADD', MINUTE, r.reservationDetails.estimatedDurationMinutes, r.reservationDetails.reservationDateTime) > :startTime")
    List<Reservation> findConflictingReservations(
        @Param("tableId") Integer tableId,
        @Param("startTime") LocalDateTime startTime,
        @Param("endTime") LocalDateTime endTime);
}
