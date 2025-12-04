package es.ubu.inf.tfg.order;

import es.ubu.inf.tfg.order.dto.OrderResponseDTO;
import es.ubu.inf.tfg.order.orderItem.dto.OrderItemRequestDTO;
import es.ubu.inf.tfg.order.orderItem.dto.OrderItemResponseDTO;
import es.ubu.inf.tfg.order.status.OrderStatus;
import es.ubu.inf.tfg.order.type.barOrder.BarOrder;
import es.ubu.inf.tfg.order.type.barOrder.dto.BarOrderRequestDTO;
import es.ubu.inf.tfg.order.type.diningOrder.DiningOrder;
import es.ubu.inf.tfg.order.type.diningOrder.dto.DiningOrderRequestDTO;

import es.ubu.inf.tfg.product.Product;
import es.ubu.inf.tfg.product.ProductRepository;
import es.ubu.inf.tfg.reservation.diningTable.DiningTable;
import es.ubu.inf.tfg.reservation.diningTable.DiningTableRepository;
import es.ubu.inf.tfg.user.User;
import es.ubu.inf.tfg.user.UserRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest
@Transactional
class OrderServiceIntegrationTest {

    @Autowired
    private OrderService orderService;
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private DiningTableRepository diningTableRepository;

    
    private static final String USERNAME_EMPLOYEE = "test.employee";
    private static final String FIRST_NAME_EMPLOYEE = "Test";
    private static final String LAST_NAME_EMPLOYEE = "Employee";
    private static final String PASSWORD_EMPLOYEE = "password";
    
    private static final String PRODUCT_NAME_BEER = "Beer";
    private static final String PRODUCT_DESCRIPTION_BEER = "Craft Beer";
    private static final BigDecimal PRODUCT_PRICE_BEER = new BigDecimal("5.00");
    
    private static final String PRODUCT_NAME_BURGER = "Burger";
    private static final String PRODUCT_DESCRIPTION_BURGER = "Cheese Burger";
    private static final BigDecimal PRODUCT_PRICE_BURGER = new BigDecimal("12.50");
    
    private static final String TABLE_NAME = "Table-1";
    private static final Integer TABLE_CAPACITY = 4;
    
    private static final String ORDER_TYPE_BAR = "BAR";
    private static final String ORDER_TYPE_DINING = "DINING";
    private static final String ORDER_NUMBER_PREFIX = "ORD-";

    private User employee;
    private Product product1;
    private Product product2;
    private DiningTable diningTable;


    @BeforeEach
    void setUp() {

        orderRepository.deleteAll();
        productRepository.deleteAll();
        diningTableRepository.deleteAll();
        userRepository.deleteAll();

        employee = userRepository.save(User.builder()
                .username(USERNAME_EMPLOYEE)
                .firstName(FIRST_NAME_EMPLOYEE)
                .lastName(LAST_NAME_EMPLOYEE)
                .password(PASSWORD_EMPLOYEE)
                .build());

        product1 = productRepository.save(Product.builder()
                .name(PRODUCT_NAME_BEER)
                .description(PRODUCT_DESCRIPTION_BEER)
                .price(PRODUCT_PRICE_BEER)
                .build());

        product2 = productRepository.save(Product.builder()
                .name(PRODUCT_NAME_BURGER)
                .description(PRODUCT_DESCRIPTION_BURGER)
                .price(PRODUCT_PRICE_BURGER)
                .build());

        diningTable = diningTableRepository.save(DiningTable.builder()
                .name(TABLE_NAME)
                .capacity(TABLE_CAPACITY)
                .isActive(true)
                .build());
    }
    

    // --------------------------------------------------------

    @Test
    void createBarOrder_ShouldPersistWithCorrectTypeAndDefaults() {
        
        final String CUSTOMER_NAME = "Bar Customer";
        
        BarOrderRequestDTO requestDTO = BarOrderRequestDTO.builder()
                .orderType(ORDER_TYPE_BAR)
                .customerName(CUSTOMER_NAME)
                .employeeId(employee.getId())
                .drinksOnly(true)
                .build();

        OrderResponseDTO result = orderService.create(requestDTO);

        assertThat(result).isNotNull();
        assertThat(result.getId()).isNotNull();
        assertThat(result.getOrderType()).isEqualTo(ORDER_TYPE_BAR);
        assertThat(result.getCustomerName()).isEqualTo(CUSTOMER_NAME);
        assertThat(result.getStatus()).isEqualTo(OrderStatus.PENDING);
        assertThat(result.getTotalAmount()).isEqualByComparingTo(BigDecimal.ZERO);

        Order persistedOrder = orderRepository.findById(result.getId()).orElseThrow();
        assertThat(persistedOrder).isInstanceOf(BarOrder.class);
        BarOrder barOrder = (BarOrder) persistedOrder;
        assertThat(barOrder.getDrinksOnly()).isTrue();
        assertThat(barOrder.getOrderNumber()).isNotNull().startsWith(ORDER_NUMBER_PREFIX);
    }

    @Test
    void createDiningOrder_ShouldPersistWithTableRelation() {
        
        final String CUSTOMER_NAME = "Dining Customer";
        
        DiningOrderRequestDTO requestDTO = DiningOrderRequestDTO.builder()
                .orderType(ORDER_TYPE_DINING)
                .customerName(CUSTOMER_NAME)
                .employeeId(employee.getId())
                .tableId(diningTable.getId())
                .build();

        OrderResponseDTO result = orderService.create(requestDTO);

        assertThat(result).isNotNull();
        assertThat(result.getId()).isNotNull();
        assertThat(result.getOrderType()).isEqualTo(ORDER_TYPE_DINING);
        assertThat(result.getCustomerName()).isEqualTo(CUSTOMER_NAME);

        Order persistedOrder = orderRepository.findById(result.getId()).orElseThrow();
        assertThat(persistedOrder).isInstanceOf(DiningOrder.class);
        DiningOrder diningOrder = (DiningOrder) persistedOrder;
        assertThat(diningOrder.getTable()).isNotNull();
        assertThat(diningOrder.getTable().getId()).isEqualTo(diningTable.getId());
    }

    @Test
    void createOrderWithItems_ShouldCalculateTotalAmountCorrectly() {
   
        final Integer BEER_QUANTITY = 2;
        final Integer BURGER_QUANTITY = 1;
        final BigDecimal EXPECTED_TOTAL = new BigDecimal("22.50");
        
        BarOrderRequestDTO requestDTO = BarOrderRequestDTO.builder()
                .orderType(ORDER_TYPE_BAR)
                .employeeId(employee.getId())
                .build();

        OrderResponseDTO result = orderService.create(requestDTO);

        OrderItemRequestDTO beerItemDTO = OrderItemRequestDTO.builder()
            .productId(product1.getId())
            .quantity(BEER_QUANTITY)
            .build();
        OrderItemRequestDTO burgerItemDTO = OrderItemRequestDTO.builder()
            .productId(product2.getId())
            .quantity(BURGER_QUANTITY)
            .build();

        orderService.addItemToOrder(result.getId(), beerItemDTO);
        orderService.addItemToOrder(result.getId(), burgerItemDTO);

        OrderResponseDTO updatedOrder = orderService.findById(result.getId());
        assertThat(updatedOrder.getTotalAmount()).isEqualByComparingTo(EXPECTED_TOTAL);
        assertThat(updatedOrder.getItems()).hasSize(2);
    }

    @Test
    void findByOrderNumber_ShouldReturnCorrectOrder() {
        
        final String CUSTOMER_NAME = "Find Customer";
        
        BarOrderRequestDTO requestDTO = BarOrderRequestDTO.builder()
                .orderType(ORDER_TYPE_BAR)
                .customerName(CUSTOMER_NAME)
                .employeeId(employee.getId())
                .build();

        OrderResponseDTO createdOrder = orderService.create(requestDTO);
        String orderNumber = createdOrder.getOrderNumber();

        OrderResponseDTO foundOrder = orderService.findByOrderNumber(orderNumber);

        assertThat(foundOrder).isNotNull();
        assertThat(foundOrder.getId()).isEqualTo(createdOrder.getId());
        assertThat(foundOrder.getOrderNumber()).isEqualTo(orderNumber);
        assertThat(foundOrder.getCustomerName()).isEqualTo(CUSTOMER_NAME);
    }

    @Test
    void updateOrderStatus_ShouldChangeStatusAndPreserveOtherData() {
        
        final String CUSTOMER_NAME = "Status Customer";
        
        BarOrderRequestDTO requestDTO = BarOrderRequestDTO.builder()
                .orderType(ORDER_TYPE_BAR)
                .customerName(CUSTOMER_NAME)
                .employeeId(employee.getId())
                .build();

        OrderResponseDTO createdOrder = orderService.create(requestDTO);

        OrderResponseDTO updatedOrder = orderService.updateStatus(createdOrder.getId(), OrderStatus.IN_PROGRESS);

        assertThat(updatedOrder.getStatus()).isEqualTo(OrderStatus.IN_PROGRESS);
        assertThat(updatedOrder.getCustomerName()).isEqualTo(CUSTOMER_NAME);
        assertThat(updatedOrder.getOrderNumber()).isEqualTo(createdOrder.getOrderNumber());
    }

    @Test
    void updateOrder_WithItems_ShouldUpdateFieldsCorrectly() {

        final String UPDATED_CUSTOMER_NAME = "Updated Customer";
        
        BarOrderRequestDTO createDTO = BarOrderRequestDTO.builder()
                .orderType(ORDER_TYPE_BAR)
                .customerName("Original Customer")
                .employeeId(employee.getId())
                .build();

        OrderResponseDTO createdOrder = orderService.create(createDTO);

        OrderItemRequestDTO itemDTO = OrderItemRequestDTO.builder()
            .productId(product1.getId())
            .quantity(2)
            .build();
        orderService.addItemToOrder(createdOrder.getId(), itemDTO);
        
        List<OrderItemResponseDTO> originalItems = createdOrder.getItems();

        BarOrderRequestDTO updateDTO = BarOrderRequestDTO.builder()
                .orderType(ORDER_TYPE_BAR)
                .customerName(UPDATED_CUSTOMER_NAME)
                .employeeId(employee.getId())
                .build();

        OrderResponseDTO updatedOrder = orderService.update(createdOrder.getId(), updateDTO);

        assertThat(updatedOrder.getCustomerName()).isEqualTo(UPDATED_CUSTOMER_NAME);
        assertThat(updatedOrder.getItems().equals(originalItems));
    }

    @Test
    void cancelOrder_ShouldSetStatusToCancelled() {
        
        BarOrderRequestDTO requestDTO = BarOrderRequestDTO.builder()
                .orderType(ORDER_TYPE_BAR)
                .customerName("Cancel Customer")
                .employeeId(employee.getId())
                .build();

        OrderResponseDTO createdOrder = orderService.create(requestDTO);

        OrderResponseDTO cancelledOrder = orderService.cancelOrder(createdOrder.getId());

        assertThat(cancelledOrder.getStatus()).isEqualTo(OrderStatus.CANCELLED);

        BarOrderRequestDTO updateDTO = BarOrderRequestDTO.builder()
                .orderType(ORDER_TYPE_BAR)
                .customerName("Modified Customer")
                .employeeId(employee.getId())
                .build();

        assertThatThrownBy(() -> orderService.update(createdOrder.getId(), updateDTO))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Cannot change status");
    }

    @Test
    void removeItemFromOrder_ShouldUpdateTotalAmount() {
        
        final Integer BEER_QUANTITY = 3;
        final Integer BURGER_QUANTITY = 1;
        final BigDecimal EXPECTED_TOTAL_AFTER_REMOVAL = new BigDecimal("12.50");
        
        BarOrderRequestDTO requestDTO = BarOrderRequestDTO.builder()
                .orderType(ORDER_TYPE_BAR)
                .employeeId(employee.getId())
                .build();

        OrderResponseDTO createdOrder = orderService.create(requestDTO);

        OrderItemRequestDTO beerItemDTO = OrderItemRequestDTO.builder()
            .productId(product1.getId())
            .quantity(BEER_QUANTITY)
            .build();
        OrderItemRequestDTO burgerItemDTO = OrderItemRequestDTO.builder()
            .productId(product2.getId())
            .quantity(BURGER_QUANTITY)
            .build();

        orderService.addItemToOrder(createdOrder.getId(), beerItemDTO);
        orderService.addItemToOrder(createdOrder.getId(), burgerItemDTO);

        OrderResponseDTO orderWithItems = orderService.findById(createdOrder.getId());
        Integer itemIdToRemove = orderWithItems.getItems().stream()
                .filter(item -> item.getProductName().equals(PRODUCT_NAME_BEER))
                .findFirst()
                .orElseThrow()
                .getId();

        OrderResponseDTO updatedOrder = orderService.removeItemFromOrder(createdOrder.getId(), itemIdToRemove);

        assertThat(updatedOrder.getTotalAmount()).isEqualByComparingTo(EXPECTED_TOTAL_AFTER_REMOVAL);
        assertThat(updatedOrder.getItems()).hasSize(1);
        assertThat(updatedOrder.getItems().get(0).getProductName()).isEqualTo(PRODUCT_NAME_BURGER);
    }

    @Test
    void findByStatus_ShouldReturnOnlyOrdersWithSpecifiedStatus() {
        
        final String PENDING_CUSTOMER_NAME = "Pending Customer";
        final String IN_PROGRESS_CUSTOMER_NAME = "In Progress Customer";
        
        BarOrderRequestDTO request1 = BarOrderRequestDTO.builder()
                .orderType(ORDER_TYPE_BAR)
                .orderNumber("ORD-XX1")
                .customerName(PENDING_CUSTOMER_NAME)
                .employeeId(employee.getId())
                .build();

        BarOrderRequestDTO request2 = BarOrderRequestDTO.builder()
                .orderType(ORDER_TYPE_BAR)
                .orderNumber("ORD-XX2")
                .customerName(IN_PROGRESS_CUSTOMER_NAME)
                .employeeId(employee.getId())
                .build();

        @SuppressWarnings("unused")
        OrderResponseDTO order1 = orderService.create(request1);
        OrderResponseDTO order2 = orderService.create(request2);

        orderService.updateStatus(order2.getId(), OrderStatus.IN_PROGRESS);

        List<OrderResponseDTO> pendingOrders = orderService.findByStatus(OrderStatus.PENDING);
        List<OrderResponseDTO> inProgressOrders = orderService.findByStatus(OrderStatus.IN_PROGRESS);

        assertThat(pendingOrders).hasSize(1);
        assertThat(pendingOrders.get(0).getCustomerName()).isEqualTo(PENDING_CUSTOMER_NAME);

        assertThat(inProgressOrders).hasSize(1);
        assertThat(inProgressOrders.get(0).getCustomerName()).isEqualTo(IN_PROGRESS_CUSTOMER_NAME);
    }

    @Test
    void findRecentOrders_ShouldReturnOrdersAfterSpecifiedDate() {
        
        final String CUSTOMER_NAME = "Recent Customer";
        
        LocalDateTime since = LocalDateTime.now().minusMinutes(1);

        BarOrderRequestDTO requestDTO = BarOrderRequestDTO.builder()
                .orderType(ORDER_TYPE_BAR)
                .customerName(CUSTOMER_NAME)
                .employeeId(employee.getId())
                .build();

        orderService.create(requestDTO);

        List<OrderResponseDTO> recentOrders = orderService.findRecentOrders(since);

        assertThat(recentOrders).isNotEmpty();
        assertThat(recentOrders.get(0).getCustomerName()).isEqualTo(CUSTOMER_NAME);
    }

    @Test
    void orderNumber_ShouldBeGeneratedAutomatically() {
        
        BarOrderRequestDTO requestDTO = BarOrderRequestDTO.builder()
                .orderType(ORDER_TYPE_BAR)
                .employeeId(employee.getId())
                .build();

        OrderResponseDTO result = orderService.create(requestDTO);

        assertThat(result.getOrderNumber()).isNotNull().startsWith(ORDER_NUMBER_PREFIX);
        assertThat(result.getOrderNumber()).hasSizeGreaterThan(10);

        OrderResponseDTO retrievedOrder = orderService.findById(result.getId());
        assertThat(retrievedOrder.getOrderNumber()).isEqualTo(result.getOrderNumber());
    }

    @Test
    void orderInheritance_ShouldPersistCorrectDiscriminator() {
        
        BarOrderRequestDTO barRequest = BarOrderRequestDTO.builder()
                .orderType(ORDER_TYPE_BAR)
                .orderNumber("BAR-1")
                .customerName("Bar Customer")
                .employeeId(employee.getId())
                .build();

        DiningOrderRequestDTO diningRequest = DiningOrderRequestDTO.builder()
                .orderType(ORDER_TYPE_DINING)
                .orderNumber("DIN-1")
                .customerName("Dining Customer")
                .employeeId(employee.getId())
                .tableId(diningTable.getId())
                .build();

        OrderResponseDTO barOrder = orderService.create(barRequest);
        OrderResponseDTO diningOrder = orderService.create(diningRequest);

        List<Order> allOrders = orderRepository.findAll();
        assertThat(allOrders).hasSize(2);

        Order barEntity = orderRepository.findById(barOrder.getId()).orElseThrow();
        Order diningEntity = orderRepository.findById(diningOrder.getId()).orElseThrow();

        assertThat(barEntity).isInstanceOf(BarOrder.class);
        assertThat(diningEntity).isInstanceOf(DiningOrder.class);
    }
}
