package es.ubu.inf.tfg.reservation;

import es.ubu.inf.tfg.reservation.details.ReservationStatus;
import es.ubu.inf.tfg.reservation.diningTable.DiningTable;
import es.ubu.inf.tfg.reservation.diningTable.DiningTableService;
import es.ubu.inf.tfg.reservation.dto.ReservationRequestDTO;
import es.ubu.inf.tfg.reservation.dto.ReservationResponseDTO;
import es.ubu.inf.tfg.reservation.dto.mapper.ReservationMapper;

import jakarta.persistence.EntityNotFoundException;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final ReservationMapper reservationMapper;
    private final DiningTableService diningTableService;

    
    public List<ReservationResponseDTO> findAll() {
        return reservationRepository.findAll().stream()
                .map(reservationMapper::toResponseDTO)
                .toList();
    }

    public ReservationResponseDTO findById(Integer id) {
        Reservation reservation = findEntityById(id);
        return reservationMapper.toResponseDTO(reservation);
    }

    public Reservation findEntityById(Integer id) {
        return reservationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Reservation not found with id: " + id));
    }

    public List<ReservationResponseDTO> findByTable(Integer tableId) {
        return reservationRepository.findByDiningTableId(tableId).stream()
                .map(reservationMapper::toResponseDTO)
                .toList();
    }

    public List<ReservationResponseDTO> findByStatus(ReservationStatus status) {
        return reservationRepository.findByStatus(status).stream()
                .map(reservationMapper::toResponseDTO)
                .toList();
    }

    public List<ReservationResponseDTO> findByDateRange(LocalDateTime start, LocalDateTime end) {
        return reservationRepository.findByReservationDetailsReservationDateTimeBetween(start, end).stream()
                .map(reservationMapper::toResponseDTO)
                .toList();
    }

    public boolean existsById(Integer id) {
        return reservationRepository.existsById(id);
    }


    // --------------------------------------------------------
    // CRUD METHODS
    
    public ReservationResponseDTO create(ReservationRequestDTO reservationRequest) {
        
        validateReservationRequest(reservationRequest);
        checkForSchedulingConflicts(reservationRequest, null);
        
        DiningTable table = diningTableService.findActiveTableById(reservationRequest.getDiningTableId());
        
        Reservation reservation = reservationMapper.toEntity(reservationRequest);
        reservation.setDiningTable(table);
        
        Reservation savedReservation = reservationRepository.save(reservation);
        return reservationMapper.toResponseDTO(savedReservation);
    }

    public ReservationResponseDTO update(Integer id, ReservationRequestDTO reservationRequest) {
        
        Reservation existingReservation = findEntityById(id);
        
        if (existingReservation.getStatus() == ReservationStatus.COMPLETED || 
            existingReservation.getStatus() == ReservationStatus.CANCELLED) {
            throw new IllegalArgumentException("Cannot modify a completed or cancelled reservation");
        }
        
        validateReservationRequest(reservationRequest);
        checkForSchedulingConflicts(reservationRequest, id);
        
        reservationMapper.updateEntityFromDTO(reservationRequest, existingReservation);
        
        Reservation updatedReservation = reservationRepository.save(existingReservation);
        return reservationMapper.toResponseDTO(updatedReservation);
    }

    public void delete(Integer id) {
        
        Reservation reservation = findEntityById(id);        
        reservationRepository.delete(reservation);
    }


    // --------------------------------------------------------
    // STATUS MANAGEMENT
    
    public ReservationResponseDTO updateStatus(Integer id, ReservationStatus newStatus) {
        
        Reservation reservation = findEntityById(id);
        ReservationStatus oldStatus = reservation.getStatus();
        
        validateStatusTransition(oldStatus, newStatus);
        reservation.setStatus(newStatus);

        Reservation updatedReservation = reservationRepository.save(reservation);
        return reservationMapper.toResponseDTO(updatedReservation);
    }

    public ReservationResponseDTO cancelReservation(Integer id) {
        return updateStatus(id, ReservationStatus.CANCELLED);
    }

    public ReservationResponseDTO markAsSeated(Integer id) {
        return updateStatus(id, ReservationStatus.SEATED);
    }

    public ReservationResponseDTO markAsCompleted(Integer id) {
        return updateStatus(id, ReservationStatus.COMPLETED);
    }


    // --------------------------------------------------------
    
    private void checkForSchedulingConflicts(ReservationRequestDTO reservationRequest, Integer excludeReservationId) {
        
        LocalDateTime startTime = reservationRequest.getReservationDateTime();
        LocalDateTime endTime = startTime.plusMinutes(
            reservationRequest.getEstimatedDurationMinutes() != null ? 
            reservationRequest.getEstimatedDurationMinutes() : 120
        );
        
        List<Reservation> conflicts = reservationRepository.findConflictingReservations(
            reservationRequest.getDiningTableId(), startTime, endTime);
        
        // Filter the current reservation if it's an update
        if (excludeReservationId != null) {
            conflicts = conflicts.stream()
                .filter(r -> !r.getId().equals(excludeReservationId))
                .toList();
        }
        
        if (!conflicts.isEmpty()) {
            throw new IllegalArgumentException(
                "Table is already reserved for the requested time slot");
        }
    }

    private void validateReservationRequest(ReservationRequestDTO reservationRequest) {
        
        if (reservationRequest.getReservationDateTime().isBefore(LocalDateTime.now().plusHours(2))) {
            throw new IllegalArgumentException("Reservation date must be in the future");
        }
        
        DiningTable table = diningTableService.findEntityById(reservationRequest.getDiningTableId());
        if (reservationRequest.getNumberOfGuests() > table.getCapacity()) {
            throw new IllegalArgumentException(
                "Number of guests (" + reservationRequest.getNumberOfGuests() + 
                ") exceeds table capacity (" + table.getCapacity() + ")");
        }
    }

    private void validateStatusTransition(ReservationStatus oldStatus, ReservationStatus newStatus) {
        
        if (oldStatus == ReservationStatus.CANCELLED || oldStatus == ReservationStatus.COMPLETED) {
            throw new IllegalArgumentException("Cannot change status of a " + oldStatus + " reservation");
        }
        if (newStatus == ReservationStatus.CONFIRMED && oldStatus != ReservationStatus.CONFIRMED) {
            throw new IllegalArgumentException("Cannot revert to CONFIRMED status");
        }
    }
}
