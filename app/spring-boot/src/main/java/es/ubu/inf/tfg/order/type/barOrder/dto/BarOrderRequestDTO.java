package es.ubu.inf.tfg.order.type.barOrder.dto;

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
public class BarOrderRequestDTO extends OrderRequestDTO {
    
    @NotNull
    private Boolean drinksOnly;
}
