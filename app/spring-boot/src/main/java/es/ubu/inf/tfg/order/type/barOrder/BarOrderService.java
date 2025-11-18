package es.ubu.inf.tfg.order.type.barOrder;

import es.ubu.inf.tfg.order.dto.OrderResponseDTO;
import es.ubu.inf.tfg.order.status.OrderStatus;
import es.ubu.inf.tfg.order.type.barOrder.dto.BarOrderResponseDTO;
import es.ubu.inf.tfg.order.type.barOrder.dto.mapper.BarOrderMapper;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class BarOrderService {
    
    private final BarOrderRepository barOrderRepository;
    private final BarOrderMapper barOrderMapper;


    public List<BarOrderResponseDTO> findByDrinksOnly(Boolean drinksOnly) {
        return barOrderRepository.findByDrinksOnly(drinksOnly).stream()
                .map(barOrderMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    public List<BarOrderResponseDTO> findByStatus(OrderStatus status) {
        return barOrderRepository.findByStatus(status).stream()
                .map(barOrderMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    public List<BarOrderResponseDTO> findByDrinksOnlyAndStatus(Boolean drinksOnly, OrderStatus status) {
        return barOrderRepository.findByDrinksOnlyAndStatus(drinksOnly, status).stream()
                .map(barOrderMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    public List<OrderResponseDTO> findByEmployeeId(Integer employeeId) {
        return barOrderRepository.findByEmployeeId(employeeId).stream()
                .map(barOrderMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    public List<OrderResponseDTO> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end) {
        return barOrderRepository.findByCreatedAtBetween(start, end).stream()
                .map(barOrderMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    public List<BarOrderResponseDTO> findPendingBarOrders() {
        return barOrderRepository.findPendingBarOrders(
                List.of(OrderStatus.PENDING, OrderStatus.IN_PROGRESS)).stream()
                .map(barOrderMapper::toResponseDTO).collect(Collectors.toList());
    }

    public List<BarOrderResponseDTO> findTodayBarOrders() {
        LocalDateTime startOfDay = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        return barOrderRepository.findTodayBarOrders(startOfDay).stream()
                .map(barOrderMapper::toResponseDTO)
                .collect(Collectors.toList());
    }
}
