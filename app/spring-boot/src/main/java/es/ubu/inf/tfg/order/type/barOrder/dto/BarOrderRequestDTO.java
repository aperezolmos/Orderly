package es.ubu.inf.tfg.order.type.barOrder.dto;

import es.ubu.inf.tfg.order.dto.OrderRequestDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
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
    
    @Builder.Default
    private Boolean drinksOnly = false;
}
