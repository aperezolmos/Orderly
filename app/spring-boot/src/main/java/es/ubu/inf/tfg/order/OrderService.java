package es.ubu.inf.tfg.order;

import es.ubu.inf.tfg.order.dto.OrderRequestDTO;
import es.ubu.inf.tfg.order.dto.OrderResponseDTO;
import es.ubu.inf.tfg.order.dto.mapper.OrderMapperFactory;
import es.ubu.inf.tfg.order.orderItem.OrderItem;
import es.ubu.inf.tfg.order.orderItem.dto.OrderItemRequestDTO;
import es.ubu.inf.tfg.order.status.OrderStatus;

import es.ubu.inf.tfg.product.Product;
import es.ubu.inf.tfg.product.ProductService;

import jakarta.persistence.EntityNotFoundException;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderMapperFactory orderMapperFactory;
    private final ProductService productService;


    public List<OrderResponseDTO> findAll() {
        return orderRepository.findAll().stream()
                .map(orderMapperFactory::toResponseDTO)
                .collect(Collectors.toList());
    }

    public OrderResponseDTO findById(Integer id) {
        Order order = findEntityById(id);
        return orderMapperFactory.toDetailedResponseDTO(order);
    }

    public Order findEntityById(Integer id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Order not found with id: " + id));
    }

    public OrderResponseDTO findByOrderNumber(String orderNumber) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new EntityNotFoundException("Order not found with number: " + orderNumber));
        return orderMapperFactory.toDetailedResponseDTO(order);
    }

    public List<OrderResponseDTO> findByStatus(OrderStatus status) {
        return orderRepository.findByStatus(status).stream()
                .map(orderMapperFactory::toResponseDTO)
                .collect(Collectors.toList());
    }

    public List<OrderResponseDTO> findByEmployeeId(Integer employeeId) {
        return orderRepository.findByEmployeeId(employeeId).stream()
                .map(orderMapperFactory::toResponseDTO)
                .collect(Collectors.toList());
    }

    public List<OrderResponseDTO> findRecentOrders(LocalDateTime since) {
        return orderRepository.findRecentOrders(since).stream()
                .map(orderMapperFactory::toResponseDTO)
                .collect(Collectors.toList());
    }

    public boolean existsById(Integer id) {
        return orderRepository.existsById(id);
    }


    // --------------------------------------------------------
    // CRUD METHODS

    public OrderResponseDTO create(OrderRequestDTO orderRequest) {
        
        Order order = orderMapperFactory.toEntity(orderRequest);
        associateItemsWithOrder(order);
        order.calculateTotalAmount();
        
        Order savedOrder = orderRepository.save(order);
        return orderMapperFactory.toDetailedResponseDTO(savedOrder);
    }

    public OrderResponseDTO update(Integer id, OrderRequestDTO orderRequest) {
        
        Order existingOrder = findEntityById(id);
        
        validateStatusTransition(existingOrder.getStatus());
        
        orderMapperFactory.updateEntityFromDTO(orderRequest, existingOrder);
        updateOrderItems(existingOrder, orderRequest.getItems());
        
        Order updatedOrder = orderRepository.save(existingOrder);
        return orderMapperFactory.toDetailedResponseDTO(updatedOrder);
    }

    public void delete(Integer id) {
        
        Order order = findEntityById(id);
        orderRepository.delete(order);
    }


    // --------------------------------------------------------
    // STATUS MANAGEMENT
    
    public OrderResponseDTO updateStatus(Integer id, OrderStatus newStatus) {
        
        Order order = findEntityById(id);
        
        validateStatusTransition(order.getStatus());
        order.setStatus(newStatus);
        
        Order updated = orderRepository.save(order);
        return orderMapperFactory.toResponseDTO(updated);
    }

    public OrderResponseDTO cancelOrder(Integer id) {
        return updateStatus(id, OrderStatus.CANCELLED);
    }

    public OrderResponseDTO markAsPaid(Integer id) {
        return updateStatus(id, OrderStatus.PAID);
    }


    // --------------------------------------------------------
    // DOMAIN METHODS (order items)
    
    public OrderResponseDTO addItemToOrder(Integer orderId, OrderItemRequestDTO itemRequest) {
        
        Order order = findEntityById(orderId);
        Product product = productService.findEntityById(itemRequest.getProductId());

        validateStatusTransition(order.getStatus());
        
        if (order.getItems() == null) order.setItems(new ArrayList<>());
        createOrderItem(order, product, itemRequest.getQuantity());
        
        Order updated = orderRepository.save(order);
        return orderMapperFactory.toDetailedResponseDTO(updated);
    }
    
    public OrderResponseDTO removeItemFromOrder(Integer orderId, Integer itemId) {
        
        Order order = findEntityById(orderId);

        validateStatusTransition(order.getStatus());
        
        OrderItem itemToRemove = order.getItems().stream()
                .filter(item -> item.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new EntityNotFoundException("Item with id " + itemId + " not found in"
                + " order with id " + orderId));
        
        order.removeItem(itemToRemove);
        
        Order updated = orderRepository.save(order);
        return orderMapperFactory.toDetailedResponseDTO(updated);
    }


    // --------------------------------------------------------
    
    private void validateStatusTransition(OrderStatus oldStatus) {
        if (oldStatus == OrderStatus.CANCELLED || oldStatus == OrderStatus.PAID) {
            throw new IllegalArgumentException("Cannot change status of a " + oldStatus + " order");
        }
    }

    private void associateItemsWithOrder(Order order) {
        if (order.getItems() != null) {
            for (OrderItem item : order.getItems()) {
                item.setOrder(order);
            }
        }
    }

    private void updateOrderItems(Order order, List<OrderItemRequestDTO> newItems) {
        
        if (newItems == null) return;

        Map<Integer, OrderItem> existingItemsMap = Optional.ofNullable(order.getItems())
            .orElseGet(Collections::emptyList)
            .stream()
            .collect(Collectors.toMap(
                item -> item.getProduct().getId(), 
                item -> item
            ));

        for (OrderItemRequestDTO newItemRequest : newItems) {
            
            Integer productId = newItemRequest.getProductId();
            Product product = productService.findEntityById(productId); 
            OrderItem existingItem = existingItemsMap.get(productId);

            if (existingItem != null) { // Product already exists in order - update its info

                existingItem.setQuantity(newItemRequest.getQuantity()); 

                BigDecimal currentPrice = new BigDecimal(String.valueOf(product.getPrice()));
                if (existingItem.getUnitPrice().compareTo(currentPrice) != 0) {
                    existingItem.setUnitPrice(currentPrice);
                    existingItem.calculateTotalPrice();
                    order.calculateTotalAmount();
                }
                // Mark as "processed" so it is not deleted
                existingItemsMap.remove(productId); 
            } 
            else { // Product does not exist in order - add.
                createOrderItem(order, product, newItemRequest.getQuantity());
            }
        }

        // Any remaining items in existingItemsMap are no longer in the request and should be removed
        existingItemsMap.values().forEach(order::removeItem);
    }

    private OrderItem createOrderItem(Order order, Product product, Integer quantity) {

        OrderItem newItem = OrderItem.builder()
                .product(product)
                .quantity(quantity)
                .unitPrice(new BigDecimal(String.valueOf(product.getPrice())))
                .order(order)
                .build();

        newItem.calculateTotalPrice();
        order.addItem(newItem);

        return newItem;
    }
}
