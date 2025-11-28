package es.ubu.inf.tfg.order.dto.mapper;

import es.ubu.inf.tfg.order.Order;
import es.ubu.inf.tfg.order.dto.OrderRequestDTO;
import es.ubu.inf.tfg.order.dto.OrderResponseDTO;

import es.ubu.inf.tfg.order.type.barOrder.BarOrder;
import es.ubu.inf.tfg.order.type.barOrder.dto.BarOrderRequestDTO;
import es.ubu.inf.tfg.order.type.barOrder.dto.BarOrderResponseDTO;
import es.ubu.inf.tfg.order.type.barOrder.dto.mapper.BarOrderMapper;

import es.ubu.inf.tfg.order.type.diningOrder.DiningOrder;
import es.ubu.inf.tfg.order.type.diningOrder.dto.DiningOrderRequestDTO;
import es.ubu.inf.tfg.order.type.diningOrder.dto.DiningOrderResponseDTO;
import es.ubu.inf.tfg.order.type.diningOrder.dto.mapper.DiningOrderMapper;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;


@ExtendWith(MockitoExtension.class)
class OrderMapperFactoryTest {

    // Inner classes for using the final 'getClass()' method (cannot be mocked)
    static class UnknownOrderRequestDTO extends OrderRequestDTO {
    }

    static class UnknownOrder extends Order {
        @Override
        public void calculateTotalAmount() {
        }
    }
    

    // --------------------------------------------------------

    @InjectMocks
    private OrderMapperFactory orderMapperFactory;

    @Mock
    private BarOrderMapper barOrderMapper;
    @Mock
    private DiningOrderMapper diningOrderMapper;


    private BarOrderRequestDTO barOrderRequestDTO;
    private DiningOrderRequestDTO diningOrderRequestDTO;
    private BarOrder barOrder;
    private DiningOrder diningOrder;
    private BarOrderResponseDTO barOrderResponseDTO;
    private DiningOrderResponseDTO diningOrderResponseDTO;


    @BeforeEach
    void setUp() {
        
        barOrderRequestDTO = BarOrderRequestDTO.builder()
                .orderType("BAR")
                .customerName("Bar Customer")
                .employeeId(1)
                .drinksOnly(false)
                .build();

        diningOrderRequestDTO = DiningOrderRequestDTO.builder()
                .orderType("DINING")
                .customerName("Dining Customer")
                .employeeId(2)
                .tableId(5)
                .build();

        barOrder = mock(BarOrder.class);
        diningOrder = mock(DiningOrder.class);

        barOrderResponseDTO = BarOrderResponseDTO.builder()
                .id(1)
                .orderNumber("BAR-001")
                .orderType("BAR")
                .customerName("Bar Customer")
                .drinksOnly(false)
                .build();

        diningOrderResponseDTO = DiningOrderResponseDTO.builder()
                .id(2)
                .orderNumber("DINING-001")
                .orderType("DINING")
                .customerName("Dining Customer")
                .tableId(5)
                .build();
    }


    // --------------------------------------------------------

    @Test
    void toEntity_WithBarOrderRequestDTO_ShouldCallBarOrderMapper() {
        
        when(barOrderMapper.toEntity(barOrderRequestDTO)).thenReturn(barOrder);

        Order result = orderMapperFactory.toEntity(barOrderRequestDTO);

        assertThat(result).isEqualTo(barOrder);
        verify(barOrderMapper).toEntity(barOrderRequestDTO);
        verifyNoInteractions(diningOrderMapper);
    }

    @Test
    void toEntity_WithDiningOrderRequestDTO_ShouldCallDiningOrderMapper() {
        
        when(diningOrderMapper.toEntity(diningOrderRequestDTO)).thenReturn(diningOrder);

        Order result = orderMapperFactory.toEntity(diningOrderRequestDTO);

        assertThat(result).isEqualTo(diningOrder);
        verify(diningOrderMapper).toEntity(diningOrderRequestDTO);
        verifyNoInteractions(barOrderMapper);
    }

    @Test
    void toEntity_WithUnknownDTOType_ShouldThrowException() {
        
        UnknownOrderRequestDTO unknownDTO = new UnknownOrderRequestDTO();

        assertThatThrownBy(() -> orderMapperFactory.toEntity(unknownDTO))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Unknown Order DTO type: UnknownOrderRequestDTO");

        verifyNoInteractions(barOrderMapper, diningOrderMapper);
    }

    @Test
    void toResponseDTO_WithBarOrder_ShouldCallBarOrderMapper() {
        
        when(barOrderMapper.toResponseDTO(barOrder)).thenReturn(barOrderResponseDTO);

        OrderResponseDTO result = orderMapperFactory.toResponseDTO(barOrder);

        assertThat(result).isEqualTo(barOrderResponseDTO);
        verify(barOrderMapper).toResponseDTO(barOrder);
        verifyNoInteractions(diningOrderMapper);
    }

    @Test
    void toResponseDTO_WithDiningOrder_ShouldCallDiningOrderMapper() {
        
        when(diningOrderMapper.toResponseDTO(diningOrder)).thenReturn(diningOrderResponseDTO);

        OrderResponseDTO result = orderMapperFactory.toResponseDTO(diningOrder);

        assertThat(result).isEqualTo(diningOrderResponseDTO);
        verify(diningOrderMapper).toResponseDTO(diningOrder);
        verifyNoInteractions(barOrderMapper);
    }

    @Test
    void toResponseDTO_WithUnknownOrderType_ShouldThrowException() {
        
        UnknownOrder unknownOrder = new UnknownOrder();

        assertThatThrownBy(() -> orderMapperFactory.toResponseDTO(unknownOrder))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Unknown Order type: UnknownOrder");

        verifyNoInteractions(barOrderMapper, diningOrderMapper);
    }

    @Test
    void toDetailedResponseDTO_WithBarOrder_ShouldCallBarOrderMapper() {
        
        when(barOrderMapper.toDetailedResponseDTO(barOrder)).thenReturn(barOrderResponseDTO);

        OrderResponseDTO result = orderMapperFactory.toDetailedResponseDTO(barOrder);

        assertThat(result).isEqualTo(barOrderResponseDTO);
        verify(barOrderMapper).toDetailedResponseDTO(barOrder);
        verifyNoInteractions(diningOrderMapper);
    }

    @Test
    void toDetailedResponseDTO_WithDiningOrder_ShouldCallDiningOrderMapper() {
        
        when(diningOrderMapper.toDetailedResponseDTO(diningOrder)).thenReturn(diningOrderResponseDTO);

        OrderResponseDTO result = orderMapperFactory.toDetailedResponseDTO(diningOrder);

        assertThat(result).isEqualTo(diningOrderResponseDTO);
        verify(diningOrderMapper).toDetailedResponseDTO(diningOrder);
        verifyNoInteractions(barOrderMapper);
    }

    @Test
    void updateEntityFromDTO_WithBarOrderDTOAndBarOrder_ShouldCallBarOrderMapper() {
        
        orderMapperFactory.updateEntityFromDTO(barOrderRequestDTO, barOrder);

        verify(barOrderMapper).updateEntityFromDTO(barOrderRequestDTO, barOrder);
        verifyNoInteractions(diningOrderMapper);
    }

    @Test
    void updateEntityFromDTO_WithDiningOrderDTOAndDiningOrder_ShouldCallDiningOrderMapper() {
        
        orderMapperFactory.updateEntityFromDTO(diningOrderRequestDTO, diningOrder);

        verify(diningOrderMapper).updateEntityFromDTO(diningOrderRequestDTO, diningOrder);
        verifyNoInteractions(barOrderMapper);
    }

    @Test
    void updateEntityFromDTO_WithMismatchedTypes_ShouldThrowException() {
        
        BarOrderRequestDTO barDTO = BarOrderRequestDTO.builder()
                .orderType("BAR")
                .employeeId(1)
                .build();
        
        DiningOrder diningEntity = mock(DiningOrder.class);

        assertThatThrownBy(() -> orderMapperFactory.updateEntityFromDTO(barDTO, diningEntity))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Unknown Order DTO type: BarOrderRequestDTO")
                .hasMessageContaining("or Order type: DiningOrder");

        verifyNoInteractions(barOrderMapper, diningOrderMapper);
    }
}
