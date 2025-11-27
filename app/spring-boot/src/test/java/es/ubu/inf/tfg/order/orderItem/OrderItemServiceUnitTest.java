package es.ubu.inf.tfg.order.orderItem;

import es.ubu.inf.tfg.order.orderItem.dto.OrderItemResponseDTO;
import es.ubu.inf.tfg.order.orderItem.dto.mapper.OrderItemMapper;
import es.ubu.inf.tfg.order.orderItem.status.OrderItemStatus;

import jakarta.persistence.EntityNotFoundException;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderItemServiceUnitTest {

    @InjectMocks
    private OrderItemService orderItemService;

    @Mock
    private OrderItemRepository orderItemRepository;
    @Mock
    private OrderItemMapper orderItemMapper;
    

    private static final Integer ORDER_ITEM_ID = 1;
    private static final Integer ORDER_ID = 10;
    private static final OrderItemStatus ORDER_ITEM_STATUS = OrderItemStatus.PENDING;
    private static final Integer QUANTITY = 2;
    private static final BigDecimal UNIT_PRICE = new BigDecimal("5.00");
    private static final BigDecimal TOTAL_PRICE = new BigDecimal("10.00");
    private static final Integer PRODUCT_ID = 5;
    private static final String PRODUCT_NAME = "Beer";

    private OrderItem orderItem;
    private OrderItemResponseDTO orderItemResponseDTO;
    

    @BeforeEach
    void setUp() {
        
        orderItem = OrderItem.builder()
                .id(ORDER_ITEM_ID)
                .status(ORDER_ITEM_STATUS)
                .quantity(QUANTITY)
                .unitPrice(UNIT_PRICE)
                .totalPrice(TOTAL_PRICE)
                .build();

        orderItemResponseDTO = OrderItemResponseDTO.builder()
                .id(ORDER_ITEM_ID)
                .status(ORDER_ITEM_STATUS)
                .quantity(QUANTITY)
                .unitPrice(UNIT_PRICE)
                .totalPrice(TOTAL_PRICE)
                .productId(PRODUCT_ID)
                .productName(PRODUCT_NAME)
                .build();
    }


    // --------------------------------------------------------

    @Test
    void findById_ExistingOrderItem_ShouldReturnOrderItemResponseDTO() {
        
        when(orderItemRepository.findById(ORDER_ITEM_ID)).thenReturn(Optional.of(orderItem));
        when(orderItemMapper.toResponseDTO(orderItem)).thenReturn(orderItemResponseDTO);

        OrderItemResponseDTO result = orderItemService.findById(ORDER_ITEM_ID);

        assertThat(result).isEqualTo(orderItemResponseDTO);
        verify(orderItemRepository).findById(ORDER_ITEM_ID);
        verify(orderItemMapper).toResponseDTO(orderItem);
    }

    @Test
    void findById_NonExistingOrderItem_ShouldThrowException() {
        
        when(orderItemRepository.findById(ORDER_ITEM_ID)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> orderItemService.findById(ORDER_ITEM_ID))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("Order item not found with id: " + ORDER_ITEM_ID);

        verify(orderItemRepository).findById(ORDER_ITEM_ID);
        verifyNoInteractions(orderItemMapper);
    }

    @Test
    void findEntityById_ExistingOrderItem_ShouldReturnOrderItem() {
        
        when(orderItemRepository.findById(ORDER_ITEM_ID)).thenReturn(Optional.of(orderItem));

        OrderItem result = orderItemService.findEntityById(ORDER_ITEM_ID);

        assertThat(result).isEqualTo(orderItem);
        verify(orderItemRepository).findById(ORDER_ITEM_ID);
    }

    @Test
    void findEntityById_NonExistingOrderItem_ShouldThrowException() {
        
        when(orderItemRepository.findById(ORDER_ITEM_ID)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> orderItemService.findEntityById(ORDER_ITEM_ID))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("Order item not found with id: " + ORDER_ITEM_ID);
    }

    @Test
    void findByOrderId_ShouldReturnListOfOrderItemResponseDTOs() {
        
        List<OrderItem> orderItems = List.of(orderItem);
        when(orderItemRepository.findByOrderId(ORDER_ID)).thenReturn(orderItems);
        when(orderItemMapper.toResponseDTO(orderItem)).thenReturn(orderItemResponseDTO);

        List<OrderItemResponseDTO> result = orderItemService.findByOrderId(ORDER_ID);

        assertThat(result).containsExactly(orderItemResponseDTO);
        verify(orderItemRepository).findByOrderId(ORDER_ID);
        verify(orderItemMapper).toResponseDTO(orderItem);
    }

    @Test
    void findByStatus_ShouldReturnListOfOrderItemResponseDTOs() {
        
        List<OrderItem> orderItems = List.of(orderItem);
        when(orderItemRepository.findByStatus(ORDER_ITEM_STATUS)).thenReturn(orderItems);
        when(orderItemMapper.toResponseDTO(orderItem)).thenReturn(orderItemResponseDTO);

        List<OrderItemResponseDTO> result = orderItemService.findByStatus(ORDER_ITEM_STATUS);

        assertThat(result).containsExactly(orderItemResponseDTO);
        verify(orderItemRepository).findByStatus(ORDER_ITEM_STATUS);
        verify(orderItemMapper).toResponseDTO(orderItem);
    }

    @Test
    void findPendingItems_ShouldReturnPendingOrderItems() {
        
        List<OrderItem> pendingItems = List.of(orderItem);
        when(orderItemRepository.findByStatus(OrderItemStatus.PENDING)).thenReturn(pendingItems);
        when(orderItemMapper.toResponseDTO(orderItem)).thenReturn(orderItemResponseDTO);

        List<OrderItemResponseDTO> result = orderItemService.findPendingItems();

        assertThat(result).containsExactly(orderItemResponseDTO);
        verify(orderItemRepository).findByStatus(OrderItemStatus.PENDING);
        verify(orderItemMapper).toResponseDTO(orderItem);
    }

    @Test
    void updateStatus_ValidOrderItem_ShouldUpdateStatusAndReturnDTO() {
        
        OrderItemStatus newStatus = OrderItemStatus.IN_PROGRESS;
        OrderItem updatedOrderItem = OrderItem.builder()
                .id(ORDER_ITEM_ID)
                .status(newStatus)
                .quantity(QUANTITY)
                .unitPrice(UNIT_PRICE)
                .totalPrice(TOTAL_PRICE)
                .build();

        OrderItemResponseDTO updatedResponseDTO = OrderItemResponseDTO.builder()
                .id(ORDER_ITEM_ID)
                .status(newStatus)
                .quantity(QUANTITY)
                .unitPrice(UNIT_PRICE)
                .totalPrice(TOTAL_PRICE)
                .productId(PRODUCT_ID)
                .productName(PRODUCT_NAME)
                .build();

        when(orderItemRepository.findById(ORDER_ITEM_ID)).thenReturn(Optional.of(orderItem));
        when(orderItemRepository.save(orderItem)).thenReturn(updatedOrderItem);
        when(orderItemMapper.toResponseDTO(updatedOrderItem)).thenReturn(updatedResponseDTO);

        OrderItemResponseDTO result = orderItemService.updateStatus(ORDER_ITEM_ID, newStatus);

        assertThat(result).isEqualTo(updatedResponseDTO);
        assertThat(result.getStatus()).isEqualTo(newStatus);
        verify(orderItemRepository).save(orderItem);
        verify(orderItemMapper).toResponseDTO(updatedOrderItem);
        assertThat(orderItem.getStatus()).isEqualTo(newStatus);
    }

    @Test
    void updateStatus_NonExistingOrderItem_ShouldThrowException() {
        
        when(orderItemRepository.findById(ORDER_ITEM_ID)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> orderItemService.updateStatus(ORDER_ITEM_ID, OrderItemStatus.IN_PROGRESS))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("Order item not found with id: " + ORDER_ITEM_ID);

        verify(orderItemRepository).findById(ORDER_ITEM_ID);
        verify(orderItemRepository, never()).save(any());
        verifyNoInteractions(orderItemMapper);
    }
}
