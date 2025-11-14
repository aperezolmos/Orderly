package es.ubu.inf.tfg.reservation.details;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import lombok.*;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservationDetails {
    
    @Column(nullable = false)
    private Integer numberOfGuests;
    
    @Column(nullable = false)
    private LocalDateTime reservationDateTime;
    
    private Integer estimatedDurationMinutes;
    
    
    // --------------------------------------------------------
    
    public LocalDateTime calculateEstimatedEndTime() {
        return reservationDateTime.plusMinutes(estimatedDurationMinutes != null ? 
               estimatedDurationMinutes : 120); // Default 2 hours
    }
}
