package es.ubu.inf.tfg.order.type.diningOrder;

import es.ubu.inf.tfg.order.status.OrderStatus;
import es.ubu.inf.tfg.order.type.diningOrder.dto.DiningOrderResponseDTO;
import es.ubu.inf.tfg.order.type.diningOrder.dto.mapper.DiningOrderMapper;

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
class DiningOrderServiceUnitTest {

    @InjectMocks
    private DiningOrderService diningOrderService;

    @Mock
    private DiningOrderRepository diningOrderRepository;
    @Mock
    private DiningOrderMapper diningOrderMapper;


    private static final Integer ORDER_ID = 1;
    private static final String ORDER_NUMBER = "ORD-002";
    private static final BigDecimal TOTAL_AMOUNT = new BigDecimal("30.00");
    private static final LocalDateTime CREATED_AT = LocalDateTime.now().minusDays(1);

    private DiningOrder diningOrder;
    private DiningOrderResponseDTO responseDTO;


    @BeforeEach
    void setUp() {
        diningOrder = DiningOrder.builder()
                .id(ORDER_ID)
                .orderNumber(ORDER_NUMBER)
                .totalAmount(TOTAL_AMOUNT)
                .createdAt(CREATED_AT)
                .build();

        responseDTO = DiningOrderResponseDTO.builder()
                .id(ORDER_ID)
                .orderNumber(ORDER_NUMBER)
                .totalAmount(TOTAL_AMOUNT)
                .build();
    }


    // --------------------------------------------------------

    @Test
    void findAll_ShouldReturnMappedList() {
        
        List<DiningOrder> orders = List.of(diningOrder);
        when(diningOrderRepository.findAll()).thenReturn(orders);
        when(diningOrderMapper.toResponseDTO(diningOrder)).thenReturn(responseDTO);

        List<DiningOrderResponseDTO> result = diningOrderService.findAll();

        assertThat(result).containsExactly(responseDTO);
        verify(diningOrderRepository).findAll();
        verify(diningOrderMapper).toResponseDTO(diningOrder);
    }

    @Test
    void findByStatus_ShouldReturnMappedList() {
        
        List<DiningOrder> orders = List.of(diningOrder);
        when(diningOrderRepository.findByStatus(OrderStatus.PENDING)).thenReturn(orders);
        when(diningOrderMapper.toResponseDTO(diningOrder)).thenReturn(responseDTO);

        List<DiningOrderResponseDTO> result = diningOrderService.findByStatus(OrderStatus.PENDING);

        assertThat(result).containsExactly(responseDTO);
        verify(diningOrderRepository).findByStatus(OrderStatus.PENDING);
        verify(diningOrderMapper).toResponseDTO(diningOrder);
    }

    @Test
    void findByTableId_ShouldReturnMappedList() {
        
        List<DiningOrder> orders = List.of(diningOrder);
        when(diningOrderRepository.findByTableId(10)).thenReturn(orders);
        when(diningOrderMapper.toResponseDTO(diningOrder)).thenReturn(responseDTO);

        List<DiningOrderResponseDTO> result = diningOrderService.findByTableId(10);

        assertThat(result).containsExactly(responseDTO);
        verify(diningOrderRepository).findByTableId(10);
        verify(diningOrderMapper).toResponseDTO(diningOrder);
    }

    @Test
    void findByTableIdAndStatus_ShouldReturnMappedList() {
        
        List<DiningOrder> orders = List.of(diningOrder);
        when(diningOrderRepository.findByTableIdAndStatus(10, OrderStatus.PENDING)).thenReturn(orders);
        when(diningOrderMapper.toResponseDTO(diningOrder)).thenReturn(responseDTO);

        List<DiningOrderResponseDTO> result = diningOrderService.findByTableIdAndStatus(10, OrderStatus.PENDING);

        assertThat(result).containsExactly(responseDTO);
        verify(diningOrderRepository).findByTableIdAndStatus(10, OrderStatus.PENDING);
        verify(diningOrderMapper).toResponseDTO(diningOrder);
    }
}
