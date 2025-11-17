package es.ubu.inf.tfg.order.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import es.ubu.inf.tfg.order.orderItem.dto.OrderItemResponseDTO;
import es.ubu.inf.tfg.order.status.OrderStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public abstract class OrderResponseDTO {
    private Integer id;
    private String orderNumber;
    private String orderType;
    private OrderStatus status;
    private BigDecimal totalAmount;
    private String customerName;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Integer employeeId;
    private String employeeName;
    private List<OrderItemResponseDTO> items;
}
