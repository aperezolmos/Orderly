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

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceUnitTest {

    @InjectMocks
    private OrderService orderService;

    @Mock
    private OrderRepository orderRepository;
    @Mock
    private OrderMapperFactory orderMapperFactory;
    @Mock
    private ProductService productService;


    private static final Integer ORDER_ID = 1;
    private static final String ORDER_NUMBER = "ORD-xx";
    private static final Integer PRODUCT_ID = 10;
    private static final Integer ITEM_ID = 100;
    private static final String PRODUCT_NAME_BEER = "Beer";
    private static final BigDecimal PRODUCT_PRICE_BEER = new BigDecimal("5.00");
    private static final Integer QUANTITY_DEFAULT = 2;
    private static final Integer QUANTITY_INCREASED = 3;
    private static final BigDecimal TOTAL_AMOUNT_DEFAULT = new BigDecimal("10.00");

    private Order order;
    private Order anotherOrder;
    private OrderRequestDTO orderRequestDTO;
    private OrderResponseDTO orderResponseDTO;
    private OrderResponseDTO anotherOrderResponseDTO;
    private Product product;
    private OrderItem orderItem;


    @BeforeEach
    void setUp() {
        
        product = Product.builder()
                .id(PRODUCT_ID)
                .name(PRODUCT_NAME_BEER)
                .price(PRODUCT_PRICE_BEER)
                .build();

        orderItem = OrderItem.builder()
                .id(ITEM_ID)
                .product(product)
                .quantity(QUANTITY_DEFAULT)
                .unitPrice(PRODUCT_PRICE_BEER)
                .totalPrice(TOTAL_AMOUNT_DEFAULT)
                .build();

        order = mock(Order.class);
        anotherOrder = mock(Order.class);

        orderRequestDTO = mock(OrderRequestDTO.class);
        orderResponseDTO = mock(OrderResponseDTO.class);
        anotherOrderResponseDTO = mock(OrderResponseDTO.class);
    }


    // --------------------------------------------------------

    @Test
    void findAll_ShouldReturnListOfOrderResponseDTOs() {
        
        final List<Order> ORDERS = List.of(order, anotherOrder);
        final List<OrderResponseDTO> EXPECTED_RESPONSES = List.of(orderResponseDTO, anotherOrderResponseDTO);
        
        when(orderRepository.findAll()).thenReturn(ORDERS);
        when(orderMapperFactory.toResponseDTO(order)).thenReturn(orderResponseDTO);
        when(orderMapperFactory.toResponseDTO(anotherOrder)).thenReturn(anotherOrderResponseDTO);

        List<OrderResponseDTO> result = orderService.findAll();

        assertThat(result).isEqualTo(EXPECTED_RESPONSES);
        verify(orderRepository).findAll();
        verify(orderMapperFactory).toResponseDTO(order);
        verify(orderMapperFactory).toResponseDTO(anotherOrder);
    }

    @Test
    void findById_ExistingOrder_ShouldReturnOrderResponseDTO() {
        
        when(orderRepository.findById(ORDER_ID)).thenReturn(Optional.of(order));
        when(orderMapperFactory.toDetailedResponseDTO(order)).thenReturn(orderResponseDTO);

        OrderResponseDTO result = orderService.findById(ORDER_ID);

        assertThat(result).isEqualTo(orderResponseDTO);
        verify(orderRepository).findById(ORDER_ID);
        verify(orderMapperFactory).toDetailedResponseDTO(order);
    }

    @Test
    void findById_NonExistingOrder_ShouldThrowException() {
        
        final String EXPECTED_MESSAGE = "Order not found with id: " + ORDER_ID;
        
        when(orderRepository.findById(ORDER_ID)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> orderService.findById(ORDER_ID))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining(EXPECTED_MESSAGE);
    }

    @Test
    void findByStatus_ShouldReturnMappedOrders() {
        
        final List<Order> ORDERS = List.of(order);
        
        when(orderRepository.findByStatus(OrderStatus.PENDING)).thenReturn(ORDERS);
        when(orderMapperFactory.toResponseDTO(order)).thenReturn(orderResponseDTO);

        List<OrderResponseDTO> result = orderService.findByStatus(OrderStatus.PENDING);

        assertThat(result).containsExactly(orderResponseDTO);
        verify(orderRepository).findByStatus(OrderStatus.PENDING);
    }

    @Test
    void existsById_ShouldDelegateToRepository() {
        
        when(orderRepository.existsById(ORDER_ID)).thenReturn(true);

        boolean result = orderService.existsById(ORDER_ID);

        assertThat(result).isTrue();
        verify(orderRepository).existsById(ORDER_ID);
    }

    @Test
    void create_ValidOrderRequest_ShouldSaveAndReturnDetailedResponse() {
        
        when(order.getItems()).thenReturn(new ArrayList<>(List.of(orderItem)));
        when(orderMapperFactory.toEntity(orderRequestDTO)).thenReturn(order);
        when(orderRepository.save(order)).thenReturn(order);
        when(orderMapperFactory.toDetailedResponseDTO(order)).thenReturn(orderResponseDTO);

        OrderResponseDTO result = orderService.create(orderRequestDTO);

        assertThat(result).isEqualTo(orderResponseDTO);
        verify(order).calculateTotalAmount();
        verify(orderRepository).save(order);
        verify(orderMapperFactory).toDetailedResponseDTO(order);
    }

    @Test
    void update_ValidOrder_ShouldUpdateAndReturnDetailedResponse() {
        
        final List<OrderItemRequestDTO> ITEM_DTOS = List.of(
                OrderItemRequestDTO.builder().productId(PRODUCT_ID).quantity(QUANTITY_INCREASED).build()
        );

        when(orderRequestDTO.getItems()).thenReturn(ITEM_DTOS);
        when(orderRepository.findById(ORDER_ID)).thenReturn(Optional.of(order));
        when(order.getStatus()).thenReturn(OrderStatus.PENDING);
        when(productService.findEntityById(PRODUCT_ID)).thenReturn(product);
        when(orderRepository.save(order)).thenReturn(order);
        when(orderMapperFactory.toDetailedResponseDTO(order)).thenReturn(orderResponseDTO);

        OrderResponseDTO result = orderService.update(ORDER_ID, orderRequestDTO);

        assertThat(result).isEqualTo(orderResponseDTO);
        verify(orderMapperFactory).updateEntityFromDTO(orderRequestDTO, order);
        verify(orderRepository).save(order);
    }

    @Test
    void update_CancelledOrder_ShouldThrowException() {
        
        final String EXPECTED_MESSAGE = "Cannot change status";
        
        when(orderRepository.findById(ORDER_ID)).thenReturn(Optional.of(order));
        when(order.getStatus()).thenReturn(OrderStatus.CANCELLED);

        assertThatThrownBy(() -> orderService.update(ORDER_ID, orderRequestDTO))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining(EXPECTED_MESSAGE);
    }

    @Test
    void update_PaidOrder_ShouldThrowException() {
        
        final String EXPECTED_MESSAGE = "Cannot change status";
        
        when(orderRepository.findById(ORDER_ID)).thenReturn(Optional.of(order));
        when(order.getStatus()).thenReturn(OrderStatus.PAID);

        assertThatThrownBy(() -> orderService.update(ORDER_ID, orderRequestDTO))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining(EXPECTED_MESSAGE);
    }

    @Test
    void delete_ExistingOrder_ShouldDelete() {
        
        when(orderRepository.findById(ORDER_ID)).thenReturn(Optional.of(order));

        orderService.delete(ORDER_ID);

        verify(orderRepository).delete(order);
    }

    @Test
    void delete_NonExistingOrder_ShouldThrowException() {
        
        when(orderRepository.findById(ORDER_ID)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> orderService.delete(ORDER_ID))
            .isInstanceOf(EntityNotFoundException.class);
    }

    @Test
    void updateStatus_ValidTransition_ShouldUpdateStatus() {
        
        when(orderRepository.findById(ORDER_ID)).thenReturn(Optional.of(order));
        when(order.getStatus()).thenReturn(OrderStatus.PENDING);
        when(orderRepository.save(order)).thenReturn(order);
        when(orderMapperFactory.toResponseDTO(order)).thenReturn(orderResponseDTO);

        OrderResponseDTO result = orderService.updateStatus(ORDER_ID, OrderStatus.IN_PROGRESS);

        assertThat(result).isEqualTo(orderResponseDTO);
        verify(order).setStatus(OrderStatus.IN_PROGRESS);
        verify(orderRepository).save(order);
    }

    @Test
    void updateStatus_InvalidTransition_ShouldThrowException() {
        
        final String EXPECTED_MESSAGE = "Cannot change status of a PAID order";
        
        when(orderRepository.findById(ORDER_ID)).thenReturn(Optional.of(order));
        when(order.getStatus()).thenReturn(OrderStatus.PAID);

        assertThatThrownBy(() -> orderService.updateStatus(ORDER_ID, OrderStatus.READY))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining(EXPECTED_MESSAGE);
    }

    @Test
    void updateStatus_FromCancelled_ShouldThrowException() {
        
        final String EXPECTED_MESSAGE = "Cannot change status of a CANCELLED order";
        
        when(orderRepository.findById(ORDER_ID)).thenReturn(Optional.of(order));
        when(order.getStatus()).thenReturn(OrderStatus.CANCELLED);

        assertThatThrownBy(() -> orderService.updateStatus(ORDER_ID, OrderStatus.IN_PROGRESS))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining(EXPECTED_MESSAGE);
    }

    @Test
    void cancelOrder_ShouldUpdateStatusToCancelled() {
        
        when(orderRepository.findById(ORDER_ID)).thenReturn(Optional.of(order));
        when(order.getStatus()).thenReturn(OrderStatus.PENDING);
        when(orderRepository.save(order)).thenReturn(order);
        when(orderMapperFactory.toResponseDTO(order)).thenReturn(orderResponseDTO);

        OrderResponseDTO result = orderService.cancelOrder(ORDER_ID);

        assertThat(result).isEqualTo(orderResponseDTO);
        verify(order).setStatus(OrderStatus.CANCELLED);
    }

    @Test
    void markAsPaid_ShouldUpdateStatusToPaid() {
        
        when(orderRepository.findById(ORDER_ID)).thenReturn(Optional.of(order));
        when(order.getStatus()).thenReturn(OrderStatus.READY);
        when(orderRepository.save(order)).thenReturn(order);
        when(orderMapperFactory.toResponseDTO(order)).thenReturn(orderResponseDTO);

        OrderResponseDTO result = orderService.markAsPaid(ORDER_ID);

        assertThat(result).isEqualTo(orderResponseDTO);
        verify(order).setStatus(OrderStatus.PAID);
    }

    @Test
    void addItemToOrder_ValidParameters_ShouldAddItemAndReturnUpdatedOrder() {
        
        when(orderRepository.findById(ORDER_ID)).thenReturn(Optional.of(order));
        when(productService.findEntityById(PRODUCT_ID)).thenReturn(product);
        when(orderRepository.save(order)).thenReturn(order);
        when(orderMapperFactory.toDetailedResponseDTO(order)).thenReturn(orderResponseDTO);

        OrderItemRequestDTO itemRequest = OrderItemRequestDTO.builder()
            .productId(PRODUCT_ID)
            .quantity(QUANTITY_DEFAULT)
            .build();

        OrderResponseDTO result = orderService.addItemToOrder(ORDER_ID, itemRequest);

        assertThat(result).isEqualTo(orderResponseDTO);
        verify(order).addItem(any(OrderItem.class));
        verify(orderRepository).save(order);
    }

    @Test
    void addItemToOrder_PaidOrder_ShouldThrowException() {
        
        final String EXPECTED_MESSAGE = "Cannot change status of a PAID order";
        
        when(orderRepository.findById(ORDER_ID)).thenReturn(Optional.of(order));
        when(productService.findEntityById(PRODUCT_ID)).thenReturn(product);
        when(order.getStatus()).thenReturn(OrderStatus.PAID);

        OrderItemRequestDTO itemRequest = OrderItemRequestDTO.builder()
            .productId(PRODUCT_ID)
            .quantity(QUANTITY_DEFAULT)
            .build();

        assertThatThrownBy(() -> orderService.addItemToOrder(ORDER_ID, itemRequest))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining(EXPECTED_MESSAGE);
    }

    @Test
    void removeItemFromOrder_ExistingItem_ShouldRemoveItemAndReturnUpdatedOrder() {
        
        when(orderRepository.findById(ORDER_ID)).thenReturn(Optional.of(order));
        when(orderRepository.save(order)).thenReturn(order);
        when(orderMapperFactory.toDetailedResponseDTO(order)).thenReturn(orderResponseDTO);
        when(order.getItems()).thenReturn(new ArrayList<>(List.of(orderItem)));

        OrderResponseDTO result = orderService.removeItemFromOrder(ORDER_ID, ITEM_ID);

        assertThat(result).isEqualTo(orderResponseDTO);
        verify(order).removeItem(orderItem);
        verify(orderRepository).save(order);
    }

    @Test
    void removeItemFromOrder_NonExistingItem_ShouldThrowException() {
        
        final String EXPECTED_MESSAGE = "Item with id " + ITEM_ID + " not found";
        
        when(orderRepository.findById(ORDER_ID)).thenReturn(Optional.of(order));
        when(order.getItems()).thenReturn(new ArrayList<>());

        assertThatThrownBy(() -> orderService.removeItemFromOrder(ORDER_ID, ITEM_ID))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining(EXPECTED_MESSAGE);
    }

    @Test
    void removeItemFromOrder_PaidOrder_ShouldThrowException() {
        
        final String EXPECTED_MESSAGE = "Cannot change status of a PAID order";
        
        when(orderRepository.findById(ORDER_ID)).thenReturn(Optional.of(order));
        when(order.getStatus()).thenReturn(OrderStatus.PAID);

        assertThatThrownBy(() -> orderService.removeItemFromOrder(ORDER_ID, ITEM_ID))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining(EXPECTED_MESSAGE);
    }

    @Test
    void findRecentOrders_ShouldReturnMappedOrders() {
        
        final LocalDateTime SINCE = LocalDateTime.now().minusHours(1);
        final List<Order> ORDERS = List.of(order);
        
        when(orderRepository.findRecentOrders(SINCE)).thenReturn(ORDERS);
        when(orderMapperFactory.toResponseDTO(order)).thenReturn(orderResponseDTO);

        List<OrderResponseDTO> result = orderService.findRecentOrders(SINCE);

        assertThat(result).containsExactly(orderResponseDTO);
        verify(orderRepository).findRecentOrders(SINCE);
    }

    @Test
    void calculateTotalAmount_ShouldUpdateTotalAfterItemChange() {
        
        final Order ORDER_ENTITY = new Order() {
            {
                setId(ORDER_ID);
                setOrderNumber(ORDER_NUMBER);
                setStatus(OrderStatus.PENDING);
                setTotalAmount(TOTAL_AMOUNT_DEFAULT);
                setCreatedAt(LocalDateTime.now().minusDays(1));
                setItems(new ArrayList<>(List.of(orderItem)));
            }
        };

        ORDER_ENTITY.getItems().get(0).setQuantity(QUANTITY_INCREASED);
        ORDER_ENTITY.calculateTotalAmount();
        
        final BigDecimal EXPECTED_TOTAL = PRODUCT_PRICE_BEER.multiply(BigDecimal.valueOf(QUANTITY_INCREASED));
        assertThat(ORDER_ENTITY.getTotalAmount()).isEqualTo(EXPECTED_TOTAL);
    }
}