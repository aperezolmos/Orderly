package es.ubu.inf.tfg.order.details;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum OrderType {
    BAR("Bar"),
    DINING("Dining");
    
    private final String displayName;
}
