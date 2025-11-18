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
    
    private static final Integer DEFAULT_DURATION_MINUTES = 120;


    @Column(nullable = false)
    private Integer numberOfGuests;
    
    @Column(nullable = false)
    private LocalDateTime reservationDateTime;
    
    @Builder.Default
    private Integer estimatedDurationMinutes = DEFAULT_DURATION_MINUTES;
    
    
    // --------------------------------------------------------
    
    public LocalDateTime calculateEstimatedEndTime() {
        return reservationDateTime.plusMinutes(estimatedDurationMinutes != null ? 
               estimatedDurationMinutes : DEFAULT_DURATION_MINUTES);
    }
}
