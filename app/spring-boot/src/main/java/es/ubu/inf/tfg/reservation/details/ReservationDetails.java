package es.ubu.inf.tfg.reservation.details;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;

import lombok.*;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservationDetails {
    
    @Min(1)
    @Column(nullable = false)
    private Integer numberOfGuests;
    
    @Future
    @Column(nullable = false)
    private LocalDateTime reservationDateTime;
    
    @Min(30)
    private Integer estimatedDurationMinutes;
    
    // --------------------------------------------------------
    
    public LocalDateTime calculateEstimatedEndTime() {
        return reservationDateTime.plusMinutes(estimatedDurationMinutes != null ? 
               estimatedDurationMinutes : 120); // Default 2 hours
    }
}
