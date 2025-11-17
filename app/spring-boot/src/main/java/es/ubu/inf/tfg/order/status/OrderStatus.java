package es.ubu.inf.tfg.order.status;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum OrderStatus {
    PENDING("Pending"),
    IN_PROGRESS("In Progress"),
    READY("Ready"),
    SERVED("Served"),
    CANCELLED("Cancelled"),
    PAID("Paid");
    
    private final String displayName;
}
