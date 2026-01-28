package es.ubu.inf.tfg.order;

import es.ubu.inf.tfg.order.dto.OrderResponseDTO;
import es.ubu.inf.tfg.order.orderItem.OrderItemService;
import es.ubu.inf.tfg.order.orderItem.dto.OrderItemRequestDTO;
import es.ubu.inf.tfg.order.orderItem.dto.OrderItemResponseDTO;
import es.ubu.inf.tfg.order.orderItem.status.OrderItemStatus;
import es.ubu.inf.tfg.order.status.OrderStatus;

import lombok.RequiredArgsConstructor;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
    
    private final OrderService orderService;
    private final OrderItemService orderItemService;
    

    @GetMapping
    @PreAuthorize("hasAuthority('ORDER_VIEW_LIST')")
    public ResponseEntity<List<OrderResponseDTO>> getAllOrders() {
        return ResponseEntity.ok(orderService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponseDTO> getOrderById(@PathVariable Integer id) {
        return ResponseEntity.ok(orderService.findById(id));
    }

    @GetMapping("/orderNumber/{orderNumber}")
    public ResponseEntity<OrderResponseDTO> getOrderByNumber(@PathVariable String orderNumber) {
        return ResponseEntity.ok(orderService.findByOrderNumber(orderNumber));
    }   

    @GetMapping("/search")
    @PreAuthorize("hasAuthority('ORDER_VIEW_LIST')")
    public ResponseEntity<List<OrderResponseDTO>> searchOrders(
            @RequestParam(required = false) OrderStatus status,
            @RequestParam(required = false) Integer employeeId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime since) {
        
        List<OrderResponseDTO> orders;
        
        if (status != null) {
            orders = orderService.findByStatus(status);
        } else if (employeeId != null) {
            orders = orderService.findByEmployeeId(employeeId);
        } else if (since != null) {
            orders = orderService.findRecentOrders(since);
        } else {
            orders = orderService.findAll();
        }
        
        return ResponseEntity.ok(orders);
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyAuthority('ORDER_EDIT', 'ORDER_BAR_EDIT', 'ORDER_DINING_EDIT')")
    public ResponseEntity<OrderResponseDTO> updateOrderStatus(
            @PathVariable Integer id,
            @RequestParam OrderStatus status) {
        
        OrderResponseDTO updatedOrder = orderService.updateStatus(id, status);
        return ResponseEntity.ok(updatedOrder);
    }

    @PatchMapping("/{id}/cancel")
    @PreAuthorize("hasAnyAuthority('ORDER_EDIT', 'ORDER_BAR_EDIT', 'ORDER_DINING_EDIT')")
    public ResponseEntity<OrderResponseDTO> cancelOrder(@PathVariable Integer id) {
        OrderResponseDTO updatedOrder = orderService.cancelOrder(id);
        return ResponseEntity.ok(updatedOrder);
    }

    @PatchMapping("/{id}/paid")
    @PreAuthorize("hasAnyAuthority('ORDER_EDIT', 'ORDER_BAR_EDIT', 'ORDER_DINING_EDIT')")
    public ResponseEntity<OrderResponseDTO> markOrderAsPaid(@PathVariable Integer id) {
        OrderResponseDTO updatedOrder = orderService.markAsPaid(id);
        return ResponseEntity.ok(updatedOrder);
    }
    
    @GetMapping("/{id}/exists")
    public ResponseEntity<Boolean> checkOrderExists(@PathVariable Integer id) {
        return ResponseEntity.ok(orderService.existsById(id));
    }

    @GetMapping("/check-orderNumber")
    public ResponseEntity<Boolean> checkOrderNumberAvailability(@RequestParam String orderNumber) {
        return ResponseEntity.ok(!orderService.existsByOrderNumber(orderNumber));
    }


    // --------------------------------------------------------
    // ORDER ITEM ENDPOINTS

    @PostMapping("/{orderId}/items")
    @PreAuthorize("hasAnyAuthority('ORDER_EDIT', 'ORDER_BAR_EDIT', 'ORDER_DINING_EDIT')")
    public ResponseEntity<OrderResponseDTO> addItemToOrder(
            @PathVariable Integer orderId,
            @RequestBody OrderItemRequestDTO itemRequest) {
        
        OrderResponseDTO updatedOrder = orderService.addItemToOrder(orderId, itemRequest);
        return ResponseEntity.ok(updatedOrder);
    }

    @DeleteMapping("/{orderId}/items/{itemId}")
    @PreAuthorize("hasAnyAuthority('ORDER_EDIT', 'ORDER_BAR_EDIT', 'ORDER_DINING_EDIT')")
    public ResponseEntity<OrderResponseDTO> removeItemFromOrder(
            @PathVariable Integer orderId,
            @PathVariable Integer itemId) {
        
        OrderResponseDTO updatedOrder = orderService.removeItemFromOrder(orderId, itemId);
        return ResponseEntity.ok(updatedOrder);
    }

    @GetMapping("/items/pending")
    public ResponseEntity<List<OrderItemResponseDTO>> getAllPendingOrderItems() {
        return ResponseEntity.ok(orderItemService.findPendingItems());
    }

    @GetMapping("/items/{id}")
    public ResponseEntity<OrderItemResponseDTO> getOrderItemById(@PathVariable Integer id) {
        return ResponseEntity.ok(orderItemService.findById(id));
    }

    @GetMapping("/{orderId}/items")
    public ResponseEntity<List<OrderItemResponseDTO>> getOrderItemsByOrderId(@PathVariable Integer orderId) {
        return ResponseEntity.ok(orderItemService.findByOrderId(orderId));
    }

    @PatchMapping("/items/{id}/status")
    @PreAuthorize("hasAnyAuthority('ORDER_EDIT', 'ORDER_BAR_EDIT', 'ORDER_DINING_EDIT')")
    public ResponseEntity<OrderItemResponseDTO> updateOrderItemStatus(
            @PathVariable Integer id,
            @RequestParam OrderItemStatus status) {
        
        OrderItemResponseDTO updatedItem = orderItemService.updateStatus(id, status);
        return ResponseEntity.ok(updatedItem);
    }
}
