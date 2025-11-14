package es.ubu.inf.tfg.reservation.dto;

import java.time.LocalDateTime;

import es.ubu.inf.tfg.reservation.details.ReservationStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservationResponseDTO {
    private Integer id;
    private ReservationStatus status;
    private String guestFirstName;
    private String guestLastName;
    private String guestPhone;
    private String guestSpecialRequests;
    private Integer numberOfGuests;
    private LocalDateTime reservationDateTime;
    private Integer estimatedDurationMinutes;
    private LocalDateTime estimatedEndTime;
    private Integer diningTableId;
    private String diningTableName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
