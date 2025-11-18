package es.ubu.inf.tfg.order.orderItem;

import es.ubu.inf.tfg.order.orderItem.OrderItemService;
import es.ubu.inf.tfg.order.orderItem.dto.OrderItemResponseDTO;
import es.ubu.inf.tfg.order.orderItem.dto.mapper.OrderItemMapper;
import es.ubu.inf.tfg.order.orderItem.status.OrderItemStatus;

import jakarta.persistence.EntityNotFoundException;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class OrderItemService {

    private final OrderItemRepository orderItemRepository;
    private final OrderItemMapper orderItemMapper;


    public OrderItemResponseDTO findById(Integer id) {
        OrderItem item = findEntityById(id);
        return orderItemMapper.toResponseDTO(item);
    }

    public OrderItem findEntityById(Integer id) {
        return orderItemRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Order item not found with id: " + id));
    }

    public List<OrderItemResponseDTO> findByOrderId(Integer orderId) {
        return orderItemRepository.findByOrderId(orderId).stream()
                .map(orderItemMapper::toResponseDTO)
                .collect(Collectors.toList());
    }
    
    public List<OrderItemResponseDTO> findByStatus(OrderItemStatus status) {
        return orderItemRepository.findByStatus(status).stream()
                .map(orderItemMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    public List<OrderItemResponseDTO> findPendingItems() {
        return findByStatus(OrderItemStatus.PENDING);
    }


    // --------------------------------------------------------
    // STATUS MANAGEMENT

    public OrderItemResponseDTO updateStatus(Integer id, OrderItemStatus status) {

        OrderItem item = findEntityById(id);
        item.setStatus(status);

        OrderItem updatedItem = orderItemRepository.save(item);
        return orderItemMapper.toResponseDTO(updatedItem);
    }
}
