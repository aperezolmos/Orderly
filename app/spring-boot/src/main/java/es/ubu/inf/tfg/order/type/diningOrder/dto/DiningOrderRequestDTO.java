package es.ubu.inf.tfg.order.type.diningOrder.dto;

import es.ubu.inf.tfg.order.dto.OrderRequestDTO;

import jakarta.validation.constraints.NotNull;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class DiningOrderRequestDTO extends OrderRequestDTO {
    
    @NotNull(message = "Table ID is required")
    private Integer tableId;
}
