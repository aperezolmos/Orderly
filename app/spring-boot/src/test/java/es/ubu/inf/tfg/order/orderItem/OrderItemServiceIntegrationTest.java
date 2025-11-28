package es.ubu.inf.tfg.order.orderItem;

import es.ubu.inf.tfg.order.Order;
import es.ubu.inf.tfg.order.orderItem.dto.OrderItemResponseDTO;
import es.ubu.inf.tfg.order.orderItem.status.OrderItemStatus;
import es.ubu.inf.tfg.order.type.barOrder.BarOrder;

import es.ubu.inf.tfg.product.Product;
import es.ubu.inf.tfg.product.ProductRepository;
import es.ubu.inf.tfg.user.User;
import es.ubu.inf.tfg.user.UserRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
class OrderItemServiceIntegrationTest {

    @Autowired
    private OrderItemService orderItemService;
    @Autowired
    private OrderItemRepository orderItemRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private es.ubu.inf.tfg.order.OrderRepository orderRepository;


    private static final String PRODUCT_NAME_1 = "Craft Beer";
    private static final BigDecimal PRODUCT_PRICE_1 = new BigDecimal("6.50");
    private static final Integer ORDER_ITEM_QUANTITY_1 = 3;
    private static final String PRODUCT_NAME_2 = "Burger";

    private User employee;
    private Product product;
    private Order order;
    private OrderItem orderItem;


    @BeforeEach
    void setUp() {
        
        orderItemRepository.deleteAll();
        orderRepository.deleteAll();
        productRepository.deleteAll();
        userRepository.deleteAll();

        employee = userRepository.save(User.builder()
                .username("test.employee")
                .firstName("Test")
                .lastName("Employee")
                .password("password")
                .build());

        product = productRepository.save(Product.builder()
                .name(PRODUCT_NAME_1)
                .description("Local craft beer")
                .price(PRODUCT_PRICE_1)
                .build());

        order = orderRepository.save(BarOrder.builder()
                .orderNumber("TEST-001")
                .customerName("Test Customer")
                .employee(employee)
                .build());

        orderItem = orderItemRepository.save(OrderItem.builder()
                .status(OrderItemStatus.PENDING)
                .quantity(ORDER_ITEM_QUANTITY_1)
                .unitPrice(product.getPrice())
                .totalPrice(product.getPrice().multiply(BigDecimal.valueOf(ORDER_ITEM_QUANTITY_1)))
                .product(product)
                .order(order)
                .build());
    }

    // --------------------------------------------------------

    @Test
    void findById_ExistingOrderItem_ShouldReturnCorrectData() {
        
        BigDecimal EXPECTED_TOTAL_PRICE = PRODUCT_PRICE_1.multiply(BigDecimal.valueOf(ORDER_ITEM_QUANTITY_1));

        OrderItemResponseDTO result = orderItemService.findById(orderItem.getId());

        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(orderItem.getId());
        assertThat(result.getStatus()).isEqualTo(OrderItemStatus.PENDING);
        assertThat(result.getQuantity()).isEqualTo(ORDER_ITEM_QUANTITY_1);
        assertThat(result.getUnitPrice()).isEqualByComparingTo(PRODUCT_PRICE_1);
        assertThat(result.getTotalPrice()).isEqualByComparingTo(EXPECTED_TOTAL_PRICE);
        assertThat(result.getProductId()).isEqualTo(product.getId());
        assertThat(result.getProductName()).isEqualTo(PRODUCT_NAME_1);
    }

    @Test
    void findByOrderId_ShouldReturnAllItemsForOrder() {
        
        Product secondProduct = productRepository.save(Product.builder()
                .name(PRODUCT_NAME_2)
                .description("Cheese burger")
                .price(new BigDecimal("12.00"))
                .build());

        orderItemRepository.save(OrderItem.builder()
                .status(OrderItemStatus.PENDING)
                .quantity(1)
                .unitPrice(secondProduct.getPrice())
                .totalPrice(secondProduct.getPrice())
                .product(secondProduct)
                .order(order)
                .build());

        List<OrderItemResponseDTO> result = orderItemService.findByOrderId(order.getId());

        assertThat(result).hasSize(2);
        assertThat(result).extracting(OrderItemResponseDTO::getProductName)
                .containsExactlyInAnyOrder(PRODUCT_NAME_1, PRODUCT_NAME_2);
    }

    @Test
    void findByStatus_ShouldReturnOnlyItemsWithSpecifiedStatus() {
        
        OrderItem inProgressItem = orderItemRepository.save(OrderItem.builder()
                .status(OrderItemStatus.IN_PROGRESS)
                .quantity(2)
                .unitPrice(product.getPrice())
                .totalPrice(product.getPrice().multiply(BigDecimal.valueOf(2)))
                .product(product)
                .order(order)
                .build());

        List<OrderItemResponseDTO> pendingItems = orderItemService.findByStatus(OrderItemStatus.PENDING);
        List<OrderItemResponseDTO> inProgressItems = orderItemService.findByStatus(OrderItemStatus.IN_PROGRESS);

        assertThat(pendingItems).hasSize(1);
        assertThat(pendingItems.get(0).getId()).isEqualTo(orderItem.getId());

        assertThat(inProgressItems).hasSize(1);
        assertThat(inProgressItems.get(0).getId()).isEqualTo(inProgressItem.getId());
    }

    @Test
    void findPendingItems_ShouldReturnOnlyPendingItems() {
        
        orderItemRepository.save(OrderItem.builder()
                .status(OrderItemStatus.SERVED)
                .quantity(1)
                .unitPrice(product.getPrice())
                .totalPrice(product.getPrice())
                .product(product)
                .order(order)
                .build());

        List<OrderItemResponseDTO> pendingItems = orderItemService.findPendingItems();

        assertThat(pendingItems).hasSize(1);
        assertThat(pendingItems.get(0).getId()).isEqualTo(orderItem.getId());
        assertThat(pendingItems.get(0).getStatus()).isEqualTo(OrderItemStatus.PENDING);
    }

    @Test
    void updateStatus_ShouldChangeStatusAndPersist() {
        
        OrderItemResponseDTO updatedItem = orderItemService.updateStatus(orderItem.getId(), OrderItemStatus.IN_PROGRESS);

        assertThat(updatedItem.getStatus()).isEqualTo(OrderItemStatus.IN_PROGRESS);

        OrderItem persistedItem = orderItemRepository.findById(orderItem.getId()).orElseThrow();
        assertThat(persistedItem.getStatus()).isEqualTo(OrderItemStatus.IN_PROGRESS);
    }

    @Test
    void orderItemTotalPrice_ShouldBeCalculatedAutomatically() {

        BigDecimal UNIT_PRICE = new BigDecimal("5.00");
        Integer QUANTITY = 4;
        BigDecimal EXPECTED_TOTAL_PRICE = UNIT_PRICE.multiply(BigDecimal.valueOf(QUANTITY));
        
        OrderItem newOrderItem = OrderItem.builder()
                .status(OrderItemStatus.PENDING)
                .quantity(QUANTITY)
                .unitPrice(UNIT_PRICE)
                .product(product)
                .order(order)
                .build();

        OrderItem savedItem = orderItemRepository.save(newOrderItem);

        assertThat(savedItem.getTotalPrice()).isEqualByComparingTo(EXPECTED_TOTAL_PRICE);
    }

    @Test
    void orderItemBidirectionalRelationship_ShouldBeConsistent() {
        
        OrderItem newOrderItem = OrderItem.builder()
                .status(OrderItemStatus.PENDING)
                .quantity(2)
                .unitPrice(product.getPrice())
                .product(product)
                .build();
        newOrderItem.setOrder(order);

        OrderItem savedItem = orderItemRepository.save(newOrderItem);

        assertThat(savedItem.getOrder()).isEqualTo(order);
        assertThat(order.getItems()).contains(savedItem);
    }

    @Test
    void orderItemCascade_ShouldNotDeleteOrderWhenItemIsDeleted() {
        
        Integer orderId = order.getId();
        Integer itemId = orderItem.getId();

        orderItemRepository.deleteById(itemId);

        Order persistedOrder = orderRepository.findById(orderId).orElseThrow();
        assertThat(persistedOrder).isNotNull();
        assertThat(persistedOrder.getItems()).doesNotContain(orderItem);
    }

    @Test
    void orderItemWithProduct_ShouldMaintainProductRelationship() {
        
        OrderItemResponseDTO result = orderItemService.findById(orderItem.getId());

        assertThat(result.getProductId()).isEqualTo(product.getId());
        assertThat(result.getProductName()).isEqualTo(product.getName());

        OrderItem persistedItem = orderItemRepository.findById(orderItem.getId()).orElseThrow();
        assertThat(persistedItem.getProduct()).isEqualTo(product);
    }

    @Test
    void orderItemQuantityChange_ShouldRecalculateTotalPrice() {

        Integer NEW_QUANTITY = 5;
        BigDecimal NEW_PRICE = PRODUCT_PRICE_1.multiply(BigDecimal.valueOf(NEW_QUANTITY));
        
        OrderItem item = orderItemRepository.findById(orderItem.getId()).orElseThrow();

        item.setQuantity(NEW_QUANTITY);

        assertThat(item.getTotalPrice()).isEqualByComparingTo(NEW_PRICE);
    }
}
