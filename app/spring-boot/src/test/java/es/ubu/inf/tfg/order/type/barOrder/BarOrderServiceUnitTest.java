package es.ubu.inf.tfg.order.type.barOrder;

import es.ubu.inf.tfg.order.status.OrderStatus;
import es.ubu.inf.tfg.order.type.barOrder.dto.BarOrderResponseDTO;
import es.ubu.inf.tfg.order.type.barOrder.dto.mapper.BarOrderMapper;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;

import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BarOrderServiceUnitTest {

    @InjectMocks
    private BarOrderService barOrderService;

    @Mock
    private BarOrderRepository barOrderRepository;
    @Mock
    private BarOrderMapper barOrderMapper;
    

    private static final Integer ORDER_ID = 1;
    private static final String ORDER_NUMBER = "ORD-001";
    private static final BigDecimal TOTAL_AMOUNT = new BigDecimal("15.00");
    private static final LocalDateTime CREATED_AT = LocalDateTime.now().minusDays(1);

    private BarOrder barOrder;
    private BarOrderResponseDTO responseDTO;


    @BeforeEach
    void setUp() {
        barOrder = BarOrder.builder()
                .id(ORDER_ID)
                .orderNumber(ORDER_NUMBER)
                .totalAmount(TOTAL_AMOUNT)
                .createdAt(CREATED_AT)
                .drinksOnly(true)
                .build();

        responseDTO = BarOrderResponseDTO.builder()
                .id(ORDER_ID)
                .orderNumber(ORDER_NUMBER)
                .totalAmount(TOTAL_AMOUNT)
                .drinksOnly(true)
                .build();
    }

    // --------------------------------------------------------

    @Test
    void findAll_ShouldReturnMappedList() {
        
        List<BarOrder> orders = List.of(barOrder);
        when(barOrderRepository.findAll()).thenReturn(orders);
        when(barOrderMapper.toResponseDTO(barOrder)).thenReturn(responseDTO);

        List<BarOrderResponseDTO> result = barOrderService.findAll();

        assertThat(result).containsExactly(responseDTO);
        verify(barOrderRepository).findAll();
        verify(barOrderMapper).toResponseDTO(barOrder);
    }

    @Test
    void findByStatus_ShouldReturnMappedList() {
        
        List<BarOrder> orders = List.of(barOrder);
        when(barOrderRepository.findByStatus(OrderStatus.PENDING)).thenReturn(orders);
        when(barOrderMapper.toResponseDTO(barOrder)).thenReturn(responseDTO);

        List<BarOrderResponseDTO> result = barOrderService.findByStatus(OrderStatus.PENDING);

        assertThat(result).containsExactly(responseDTO);
        verify(barOrderRepository).findByStatus(OrderStatus.PENDING);
        verify(barOrderMapper).toResponseDTO(barOrder);
    }

    @Test
    void findByDrinksOnly_ShouldReturnMappedList() {
        
        List<BarOrder> orders = List.of(barOrder);
        when(barOrderRepository.findByDrinksOnly(true)).thenReturn(orders);
        when(barOrderMapper.toResponseDTO(barOrder)).thenReturn(responseDTO);

        List<BarOrderResponseDTO> result = barOrderService.findByDrinksOnly(true);

        assertThat(result).containsExactly(responseDTO);
        verify(barOrderRepository).findByDrinksOnly(true);
        verify(barOrderMapper).toResponseDTO(barOrder);
    }

    @Test
    void findByDrinksOnlyAndStatus_ShouldReturnMappedList() {
        
        List<BarOrder> orders = List.of(barOrder);
        when(barOrderRepository.findByDrinksOnlyAndStatus(true, OrderStatus.PENDING)).thenReturn(orders);
        when(barOrderMapper.toResponseDTO(barOrder)).thenReturn(responseDTO);

        List<BarOrderResponseDTO> result = barOrderService.findByDrinksOnlyAndStatus(true, OrderStatus.PENDING);

        assertThat(result).containsExactly(responseDTO);
        verify(barOrderRepository).findByDrinksOnlyAndStatus(true, OrderStatus.PENDING);
        verify(barOrderMapper).toResponseDTO(barOrder);
    }
}

