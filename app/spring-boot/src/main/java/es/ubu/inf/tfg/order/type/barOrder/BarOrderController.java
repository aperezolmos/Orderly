package es.ubu.inf.tfg.order.type.barOrder;

import es.ubu.inf.tfg.order.OrderService;
import es.ubu.inf.tfg.order.dto.OrderResponseDTO;
import es.ubu.inf.tfg.order.status.OrderStatus;
import es.ubu.inf.tfg.order.type.barOrder.dto.BarOrderRequestDTO;
import es.ubu.inf.tfg.order.type.barOrder.dto.BarOrderResponseDTO;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/orders/bar")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class BarOrderController {
    
    private final BarOrderService barOrderService;
    private final OrderService orderService;


    @GetMapping
    @PreAuthorize("hasAuthority('ORDER_BAR_VIEW_LIST')")
    public ResponseEntity<List<BarOrderResponseDTO>> getBarOrders(
            @RequestParam(required = false) Boolean drinksOnly,
            @RequestParam(required = false) OrderStatus status) {
        
        List<BarOrderResponseDTO> orders;
        
        if (drinksOnly != null && status != null) {
            orders = barOrderService.findByDrinksOnlyAndStatus(drinksOnly, status);
        } else if (drinksOnly != null) {
            orders = barOrderService.findByDrinksOnly(drinksOnly);
        } else if (status != null) {
            orders = barOrderService.findByStatus(status);
        } else {
            orders = barOrderService.findAll();
        }
        
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ORDER_BAR_VIEW_LIST')")
    public ResponseEntity<BarOrderResponseDTO> getBarOrderById(@PathVariable Integer id) {
        return ResponseEntity.ok(barOrderService.findById(id));
    }

    @GetMapping("/employee/{employeeId}")
    @PreAuthorize("hasAuthority('ORDER_BAR_VIEW_LIST')")
    public ResponseEntity<List<BarOrderResponseDTO>> getBarOrdersByEmployee(@PathVariable Integer employeeId) {
        return ResponseEntity.ok(barOrderService.findByEmployeeId(employeeId));
    }

    @GetMapping("/date-range")
    @PreAuthorize("hasAuthority('ORDER_BAR_VIEW_LIST')")
    public ResponseEntity<List<BarOrderResponseDTO>> getBarOrdersByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        return ResponseEntity.ok(barOrderService.findByCreatedAtBetween(start, end));
    }

    @GetMapping("/pending")
    @PreAuthorize("hasAuthority('ORDER_BAR_VIEW_LIST')")
    public ResponseEntity<List<BarOrderResponseDTO>> getPendingBarOrders() {
        return ResponseEntity.ok(barOrderService.findPendingBarOrders());
    }

    @GetMapping("/today")
    @PreAuthorize("hasAuthority('ORDER_BAR_VIEW_LIST')")
    public ResponseEntity<List<BarOrderResponseDTO>> getTodayBarOrders() {
        return ResponseEntity.ok(barOrderService.findTodayBarOrders());
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ORDER_BAR_CREATE')")
    public ResponseEntity<OrderResponseDTO> createBarOrder(@Valid @RequestBody BarOrderRequestDTO orderRequest) {
        OrderResponseDTO createdOrder = orderService.create(orderRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdOrder);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ORDER_BAR_EDIT')")
    public ResponseEntity<OrderResponseDTO> updateBarOrder(
            @PathVariable Integer id,
            @Valid @RequestBody BarOrderRequestDTO orderRequest) {
        
        OrderResponseDTO updatedOrder = orderService.update(id, orderRequest);
        return ResponseEntity.ok(updatedOrder);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ORDER_BAR_DELETE')")
    public ResponseEntity<Void> deleteBarOrder(@PathVariable Integer id) {
        orderService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
