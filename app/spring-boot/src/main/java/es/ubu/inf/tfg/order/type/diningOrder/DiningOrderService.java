package es.ubu.inf.tfg.order.type.diningOrder;

import es.ubu.inf.tfg.order.status.OrderStatus;
import es.ubu.inf.tfg.order.type.diningOrder.dto.DiningOrderResponseDTO;
import es.ubu.inf.tfg.order.type.diningOrder.dto.mapper.DiningOrderMapper;

import jakarta.persistence.EntityNotFoundException;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class DiningOrderService {
    
    private final DiningOrderRepository diningOrderRepository;
    private final DiningOrderMapper diningOrderMapper;


    public List<DiningOrderResponseDTO> findAll() {
        return diningOrderRepository.findAll().stream()
                .map(diningOrderMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    public DiningOrderResponseDTO findById(Integer id) {
        DiningOrder diningOrder = diningOrderRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("DiningOrder not found with id: " + id));
        return diningOrderMapper.toDetailedResponseDTO(diningOrder);
    }

    public List<DiningOrderResponseDTO> findByTableId(Integer tableId) {
        return diningOrderRepository.findByTableId(tableId).stream()
                .map(diningOrderMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    public List<DiningOrderResponseDTO> findByStatus(OrderStatus status) {
        return diningOrderRepository.findByStatus(status).stream()
                .map(diningOrderMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    public List<DiningOrderResponseDTO> findByTableIdAndStatus(Integer tableId, OrderStatus status) {
        return diningOrderRepository.findByTableIdAndStatus(tableId, status).stream()
                .map(diningOrderMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    public List<DiningOrderResponseDTO> findByEmployeeId(Integer employeeId) {
        return diningOrderRepository.findByEmployeeId(employeeId).stream()
                .map(diningOrderMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    public List<DiningOrderResponseDTO> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end) {
        return diningOrderRepository.findByCreatedAtBetween(start, end).stream()
                .map(diningOrderMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    public List<Integer> findTablesWithActiveOrders() {
        return diningOrderRepository.findTablesWithActiveOrders(
                List.of(OrderStatus.PENDING, OrderStatus.IN_PROGRESS, OrderStatus.READY));
    }

    public List<DiningOrderResponseDTO> findPendingDiningOrders() {
        return diningOrderRepository.findPendingDiningOrders(
                List.of(OrderStatus.PENDING, OrderStatus.IN_PROGRESS, OrderStatus.READY, OrderStatus.SERVED)).stream()
                .map(diningOrderMapper::toResponseDTO).collect(Collectors.toList());
    }

    public List<DiningOrderResponseDTO> findTodayDiningOrders() {
        LocalDateTime startOfDay = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        return diningOrderRepository.findTodayDiningOrders(startOfDay).stream()
                .map(diningOrderMapper::toResponseDTO)
                .collect(Collectors.toList());
    }
}
