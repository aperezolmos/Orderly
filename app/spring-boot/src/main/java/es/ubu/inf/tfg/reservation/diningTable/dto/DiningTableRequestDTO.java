package es.ubu.inf.tfg.reservation.diningTable.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DiningTableRequestDTO {
    
    @NotBlank(message = "Name is required")
    @Size(max = 10, message = "Name cannot exceed 10 characters")
    private String name;

    @NotNull(message = "Capacity is required")
    @Min(value = 1, message = "Capacity should be greater than 1")
    private Integer capacity;

    @Size(max = 100, message = "Location description cannot exceed 100 characters")
    private String locationDescription;
}
