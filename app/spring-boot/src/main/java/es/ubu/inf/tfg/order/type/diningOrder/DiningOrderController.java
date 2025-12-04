package es.ubu.inf.tfg.order.type.diningOrder;

import es.ubu.inf.tfg.order.OrderService;
import es.ubu.inf.tfg.order.dto.OrderResponseDTO;
import es.ubu.inf.tfg.order.status.OrderStatus;
import es.ubu.inf.tfg.order.type.diningOrder.dto.DiningOrderRequestDTO;
import es.ubu.inf.tfg.order.type.diningOrder.dto.DiningOrderResponseDTO;

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
@RequestMapping("/api/orders/dining")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class DiningOrderController {
    
    private final DiningOrderService diningOrderService;
    private final OrderService orderService;


    @GetMapping
    @PreAuthorize("hasAuthority('ORDER_DINING_VIEW_LIST')")
    public ResponseEntity<List<DiningOrderResponseDTO>> getDiningOrders(
            @RequestParam(required = false) Integer tableId,
            @RequestParam(required = false) OrderStatus status) {
        
        List<DiningOrderResponseDTO> orders;
        
        if (tableId != null && status != null) {
            orders = diningOrderService.findByTableIdAndStatus(tableId, status);
        } else if (tableId != null) {
            orders = diningOrderService.findByTableId(tableId);
        } else if (status != null) {
            orders = diningOrderService.findByStatus(status);
        } else {
            orders = diningOrderService.findAll();
        }
        
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ORDER_DINING_VIEW_LIST')")
    public ResponseEntity<DiningOrderResponseDTO> getDiningOrderById(@PathVariable Integer id) {
        return ResponseEntity.ok(diningOrderService.findById(id));
    }

    @GetMapping("/employee/{employeeId}")
    @PreAuthorize("hasAuthority('ORDER_DINING_VIEW_LIST')")
    public ResponseEntity<List<DiningOrderResponseDTO>> getDiningOrdersByEmployee(@PathVariable Integer employeeId) {
        return ResponseEntity.ok(diningOrderService.findByEmployeeId(employeeId));
    }

    @GetMapping("/date-range")
    @PreAuthorize("hasAuthority('ORDER_DINING_VIEW_LIST')")
    public ResponseEntity<List<DiningOrderResponseDTO>> getDiningOrdersByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        return ResponseEntity.ok(diningOrderService.findByCreatedAtBetween(start, end));
    }

    @GetMapping("/active-tables")
    @PreAuthorize("hasAuthority('ORDER_DINING_VIEW_LIST')")
    public ResponseEntity<List<Integer>> getTablesWithActiveOrders() {
        return ResponseEntity.ok(diningOrderService.findTablesWithActiveOrders());
    }

    @GetMapping("/pending")
    @PreAuthorize("hasAuthority('ORDER_DINING_VIEW_LIST')")
    public ResponseEntity<List<DiningOrderResponseDTO>> getPendingDiningOrders() {
        return ResponseEntity.ok(diningOrderService.findPendingDiningOrders());
    }

    @GetMapping("/today")
    @PreAuthorize("hasAuthority('ORDER_DINING_VIEW_LIST')")
    public ResponseEntity<List<DiningOrderResponseDTO>> getTodayDiningOrders() {
        return ResponseEntity.ok(diningOrderService.findTodayDiningOrders());
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ORDER_DINING_CREATE')")
    public ResponseEntity<OrderResponseDTO> createDiningOrder(@Valid @RequestBody DiningOrderRequestDTO orderRequest) {
        OrderResponseDTO createdOrder = orderService.create(orderRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdOrder);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ORDER_DINING_EDIT')")
    public ResponseEntity<OrderResponseDTO> updateDiningOrder(
            @PathVariable Integer id,
            @Valid @RequestBody DiningOrderRequestDTO orderRequest) {
        
        OrderResponseDTO updatedOrder = orderService.update(id, orderRequest);
        return ResponseEntity.ok(updatedOrder);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ORDER_DINING_DELETE')")
    public ResponseEntity<Void> deleteDiningOrder(@PathVariable Integer id) {
        orderService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
