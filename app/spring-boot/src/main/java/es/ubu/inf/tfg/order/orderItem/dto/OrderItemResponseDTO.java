package es.ubu.inf.tfg.order.orderItem.dto;

import java.math.BigDecimal;

import es.ubu.inf.tfg.order.orderItem.OrderItemStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemResponseDTO {
    private Integer id;
    private Integer productId;
    private String productName;
    //TODO: orderId?
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal totalPrice;
    private OrderItemStatus status;
}
