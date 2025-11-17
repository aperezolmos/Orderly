package es.ubu.inf.tfg.order.dto.mapper;

import org.springframework.stereotype.Component;

import es.ubu.inf.tfg.order.Order;
import es.ubu.inf.tfg.order.dto.OrderRequestDTO;
import es.ubu.inf.tfg.order.dto.OrderResponseDTO;

import es.ubu.inf.tfg.order.type.barOrder.BarOrder;
import es.ubu.inf.tfg.order.type.barOrder.dto.BarOrderRequestDTO;
import es.ubu.inf.tfg.order.type.barOrder.dto.mapper.BarOrderMapper;

import es.ubu.inf.tfg.order.type.diningOrder.DiningOrder;
import es.ubu.inf.tfg.order.type.diningOrder.dto.DiningOrderRequestDTO;
import es.ubu.inf.tfg.order.type.diningOrder.dto.mapper.DiningOrderMapper;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class OrderMapperFactory {
    
    private final BarOrderMapper barOrderMapper;
    private final DiningOrderMapper diningOrderMapper;


    public Order toEntity(OrderRequestDTO dto) {
        if (dto instanceof BarOrderRequestDTO barDto) {
            return barOrderMapper.toEntity(barDto);
        } 
        else if (dto instanceof DiningOrderRequestDTO diningDto) {
            return diningOrderMapper.toEntity(diningDto);
        }
        throw new IllegalArgumentException("Unknown Order DTO type: " + dto.getClass().getSimpleName());
    }

    public OrderResponseDTO toResponseDTO(Order order) {
        if (order instanceof BarOrder barOrder) {
            return barOrderMapper.toResponseDTO(barOrder);
        }
        else if (order instanceof DiningOrder diningOrder) {
            return diningOrderMapper.toResponseDTO(diningOrder);
        }
        throw new IllegalArgumentException("Unknown Order type: " + order.getClass().getSimpleName());
    }

    public OrderResponseDTO toDetailedResponseDTO(Order order) {
        if (order instanceof BarOrder barOrder) {
            return barOrderMapper.toDetailedResponseDTO(barOrder);
        }
        else if (order instanceof DiningOrder diningOrder) {
            return diningOrderMapper.toDetailedResponseDTO(diningOrder);
        }
        throw new IllegalArgumentException("Unknown Order type: " + order.getClass().getSimpleName());
    }
}
