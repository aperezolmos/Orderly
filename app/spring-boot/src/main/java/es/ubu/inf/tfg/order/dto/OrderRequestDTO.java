package es.ubu.inf.tfg.order.dto;

import java.util.List;

import es.ubu.inf.tfg.order.orderItem.dto.OrderItemRequestDTO;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public abstract class OrderRequestDTO {

    @Size(max = 20, message = "Order number cannot exceed 20 characters")
    private String orderNumber;

    @NotBlank(message = "Order type is required")
    private String orderType;
    
    @Size(max = 100, message = "Customer name cannot exceed 100 characters")
    private String customerName;

    @Size(max = 255, message = "Order notes cannot exceed 255 characters")
    private String notes;

    @NotNull(message = "Employee ID is required")
    private Integer employeeId;

    @Valid
    private List<OrderItemRequestDTO> items;
}
