package es.ubu.inf.tfg.reservation.diningTable.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DiningTableResponseDTO {
    private Integer id;
    private String name;
    private Integer capacity;
    private String locationDescription;
    private Boolean isAvailable;
    private Boolean isActive;
    private LocalDateTime createdAt;
}
