package es.ubu.inf.tfg.reservation;

import es.ubu.inf.tfg.reservation.details.ReservationStatus;
import es.ubu.inf.tfg.reservation.dto.ReservationRequestDTO;
import es.ubu.inf.tfg.reservation.dto.ReservationResponseDTO;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;


    @GetMapping
    @PreAuthorize("hasAuthority('RESERVATION_VIEW_LIST')")
    public ResponseEntity<List<ReservationResponseDTO>> getAllReservations() {
        return ResponseEntity.ok(reservationService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReservationResponseDTO> getReservationById(@PathVariable Integer id) {
        return ResponseEntity.ok(reservationService.findById(id));
    }

    @GetMapping("/search")
    @PreAuthorize("hasAuthority('RESERVATION_VIEW_LIST')")
    public ResponseEntity<List<ReservationResponseDTO>> searchReservations(
            @RequestParam(required = false) ReservationStatus status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end,
            @RequestParam(required = false) Integer tableId) {
        
        List<ReservationResponseDTO> reservations;
        
        if (status != null) {
            reservations = reservationService.findByStatus(status);
        } else if (start != null && end != null) {
            reservations = reservationService.findByDateRange(start, end);
        } else if (tableId != null) {
            reservations = reservationService.findByTable(tableId);
        } else {
            reservations = reservationService.findAll();
        }
        
        return ResponseEntity.ok(reservations);
    }

    @PostMapping
    @PreAuthorize("hasAuthority('RESERVATION_CREATE')")
    public ResponseEntity<ReservationResponseDTO> createReservation(
            @Valid @RequestBody ReservationRequestDTO request) {
        ReservationResponseDTO createdReservation = reservationService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdReservation);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('RESERVATION_EDIT')")
    public ResponseEntity<ReservationResponseDTO> updateReservation(
            @PathVariable Integer id,
            @Valid @RequestBody ReservationRequestDTO request) {
        ReservationResponseDTO updatedReservation = reservationService.update(id, request);
        return ResponseEntity.ok(updatedReservation);
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAuthority('RESERVATION_EDIT')")
    public ResponseEntity<ReservationResponseDTO> updateReservationStatus(
            @PathVariable Integer id,
            @RequestParam ReservationStatus status) {
        ReservationResponseDTO updatedReservation = reservationService.updateStatus(id, status);
        return ResponseEntity.ok(updatedReservation);
    }

    @PatchMapping("/{id}/cancel")
    @PreAuthorize("hasAuthority('RESERVATION_EDIT')")
    public ResponseEntity<ReservationResponseDTO> cancelReservation(@PathVariable Integer id) {
        ReservationResponseDTO updatedReservation = reservationService.cancelReservation(id);
        return ResponseEntity.ok(updatedReservation);
    }

    @PatchMapping("/{id}/seat")
    @PreAuthorize("hasAuthority('RESERVATION_EDIT')")
    public ResponseEntity<ReservationResponseDTO> markAsSeated(@PathVariable Integer id) {
        ReservationResponseDTO updatedReservation = reservationService.markAsSeated(id);
        return ResponseEntity.ok(updatedReservation);
    }

    @PatchMapping("/{id}/complete")
    @PreAuthorize("hasAuthority('RESERVATION_EDIT')")
    public ResponseEntity<ReservationResponseDTO> markAsCompleted(@PathVariable Integer id) {
        ReservationResponseDTO updatedReservation = reservationService.markAsCompleted(id);
        return ResponseEntity.ok(updatedReservation);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('RESERVATION_DELETE')")
    public ResponseEntity<Void> deleteReservation(@PathVariable Integer id) {
        reservationService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/exists")
    public ResponseEntity<Boolean> checkReservationExists(@PathVariable Integer id) {
        return ResponseEntity.ok(reservationService.existsById(id));
    }
}
