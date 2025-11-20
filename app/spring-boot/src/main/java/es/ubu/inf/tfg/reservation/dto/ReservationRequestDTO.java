package es.ubu.inf.tfg.reservation.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.*;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservationRequestDTO {
    
    @NotNull(message = "Dining table ID is required")
    private Integer diningTableId;

    @NotBlank(message = "Guest's first name is required")
    @Size(max = 100, message = "Guest's first name cannot exceed {max} characters")
    private String guestFirstName;

    @NotBlank(message = "Guest's last name is required")
    @Size(max = 100, message = "Guest's last name cannot exceed {max} characters")
    private String guestLastName;

    @NotBlank(message = "Guest's phone is required")
    @Size(max = 100, message = "Guest's phone cannot exceed {max} characters")
    private String guestPhone;

    @Size(max = 500, message = "Guest's special requests cannot exceed {max} characters")
    private String guestSpecialRequests;

    @NotNull(message = "Number of guests is required")
    @Min(value = 1, message = "There must be at least {value} guest")
    private Integer numberOfGuests;

    @NotNull(message = "Date and time of the reservation are required")
    @Future(message = "Reservation must be for a future date")
    private LocalDateTime reservationDateTime;

    @Min(value = 30, message = "Minimum duration is {value} minutes")
    @Max(value = 240, message = "Maximum duration is {value} minutes")
    private Integer estimatedDurationMinutes;
}
