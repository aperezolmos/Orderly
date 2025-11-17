package es.ubu.inf.tfg.order.orderItem;

import es.ubu.inf.tfg.order.orderItem.OrderItemService;
import es.ubu.inf.tfg.order.orderItem.dto.OrderItemResponseDTO;
import es.ubu.inf.tfg.order.orderItem.dto.mapper.OrderItemMapper;
import es.ubu.inf.tfg.order.orderItem.status.OrderItemStatus;

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

    public List<OrderItemResponseDTO> getPendingItems() {
        return findByStatus(OrderItemStatus.PENDING);
    }
}
