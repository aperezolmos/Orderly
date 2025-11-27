package es.ubu.inf.tfg.order.orderItem.dto.mapper;

import es.ubu.inf.tfg.order.orderItem.OrderItem;
import es.ubu.inf.tfg.order.orderItem.dto.OrderItemRequestDTO;
import es.ubu.inf.tfg.order.orderItem.dto.OrderItemResponseDTO;
import es.ubu.inf.tfg.order.orderItem.status.OrderItemStatus;

import es.ubu.inf.tfg.product.Product;
import es.ubu.inf.tfg.product.ProductService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderItemMapperTest {

    @InjectMocks
    private OrderItemMapperImpl orderItemMapper;

    @Mock
    private ProductService productService;


    private static final Integer PRODUCT_ID = 1;
    private static final String PRODUCT_NAME = "Beer";
    private static final BigDecimal PRODUCT_PRICE = new BigDecimal("5.00");
    private static final Integer QUANTITY = 2;

    private Product product;
    private OrderItemRequestDTO orderItemRequestDTO;
    private OrderItem orderItem;
    

    @BeforeEach
    void setUp() {
        
        product = Product.builder()
                .id(PRODUCT_ID)
                .name(PRODUCT_NAME)
                .price(PRODUCT_PRICE)
                .build();

        orderItemRequestDTO = OrderItemRequestDTO.builder()
                .productId(PRODUCT_ID)
                .quantity(QUANTITY)
                .build();

        orderItem = OrderItem.builder()
                .id(1)
                .status(OrderItemStatus.PENDING)
                .quantity(QUANTITY)
                .unitPrice(PRODUCT_PRICE)
                .totalPrice(PRODUCT_PRICE.multiply(BigDecimal.valueOf(QUANTITY)))
                .product(product)
                .build();
    }


    // --------------------------------------------------------

    @Test
    void toEntity_ValidRequestDTO_ShouldMapCorrectly() {
        
        when(productService.findEntityById(PRODUCT_ID)).thenReturn(product);

        OrderItem result = orderItemMapper.toEntity(orderItemRequestDTO);

        assertThat(result).isNotNull();
        assertThat(result.getId()).isNull();
        assertThat(result.getStatus()).isEqualTo(OrderItemStatus.PENDING);
        assertThat(result.getQuantity()).isEqualTo(QUANTITY);
        assertThat(result.getProduct()).isEqualTo(product);
        assertThat(result.getOrder()).isNull();

        verify(productService).findEntityById(PRODUCT_ID);
    }

    @Test
    void toEntity_NullRequestDTO_ShouldReturnNull() {
        
        OrderItem result = orderItemMapper.toEntity(null);
        assertThat(result).isNull();
        verifyNoInteractions(productService);
    }

    @Test
    void toResponseDTO_ValidOrderItem_ShouldMapCorrectly() {
        
        OrderItemResponseDTO result = orderItemMapper.toResponseDTO(orderItem);

        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(orderItem.getId());
        assertThat(result.getStatus()).isEqualTo(orderItem.getStatus());
        assertThat(result.getQuantity()).isEqualTo(orderItem.getQuantity());
        assertThat(result.getUnitPrice()).isEqualTo(orderItem.getUnitPrice());
        assertThat(result.getTotalPrice()).isEqualTo(orderItem.getTotalPrice());
        assertThat(result.getProductId()).isEqualTo(PRODUCT_ID);
        assertThat(result.getProductName()).isEqualTo(PRODUCT_NAME);
    }

    @Test
    void toResponseDTO_NullOrderItem_ShouldReturnNull() {
        
        OrderItemResponseDTO result = orderItemMapper.toResponseDTO(null);
        assertThat(result).isNull();
    }

    @Test
    void toResponseDTO_OrderItemWithNullProduct_ShouldMapWithNullProductInfo() {
        
        OrderItem orderItemWithNullProduct = OrderItem.builder()
                .id(1)
                .status(OrderItemStatus.PENDING)
                .quantity(1)
                .unitPrice(BigDecimal.TEN)
                .totalPrice(BigDecimal.TEN)
                .product(null)
                .build();

        OrderItemResponseDTO result = orderItemMapper.toResponseDTO(orderItemWithNullProduct);

        assertThat(result).isNotNull();
        assertThat(result.getProductId()).isNull();
        assertThat(result.getProductName()).isNull();
    }

    @Test
    void mapProductIdToProduct_ValidProductId_ShouldReturnProduct() {
        
        when(productService.findEntityById(PRODUCT_ID)).thenReturn(product);

        Product result = orderItemMapper.mapProductIdToProduct(PRODUCT_ID);

        assertThat(result).isEqualTo(product);
        verify(productService).findEntityById(PRODUCT_ID);
    }

    @Test
    void mapProductIdToProduct_NullProductId_ShouldReturnNull() {
        
        Product result = orderItemMapper.mapProductIdToProduct(null);

        assertThat(result).isNull();
        verifyNoInteractions(productService);
    }

    @Test
    void setOrderItemUnitPrice_AfterMapping_ShouldSetUnitPriceFromProduct() {
        
        OrderItem targetOrderItem = OrderItem.builder()
                .product(product)
                .build();

        orderItemMapper.setOrderItemUnitPrice(targetOrderItem);

        assertThat(targetOrderItem.getUnitPrice()).isEqualTo(PRODUCT_PRICE);
    }

    @Test
    void setOrderItemUnitPrice_NullOrderItem_ShouldDoNothing() {

        orderItemMapper.setOrderItemUnitPrice(null);
        // No exception should be thrown
    }

    @Test
    void setOrderItemUnitPrice_OrderItemWithNullProduct_ShouldDoNothing() {
        
        OrderItem targetOrderItem = OrderItem.builder()
                .product(null)
                .unitPrice(BigDecimal.ZERO)
                .build();

        orderItemMapper.setOrderItemUnitPrice(targetOrderItem);

        assertThat(targetOrderItem.getUnitPrice()).isEqualTo(BigDecimal.ZERO);
    }

    @Test
    void setOrderItemUnitPrice_OrderItemWithExistingUnitPrice_ShouldNotOverride() {
        
        BigDecimal existingPrice = new BigDecimal("8.00");
        OrderItem targetOrderItem = OrderItem.builder()
                .product(product)
                .unitPrice(existingPrice)
                .build();

        orderItemMapper.setOrderItemUnitPrice(targetOrderItem);

        assertThat(targetOrderItem.getUnitPrice()).isEqualTo(existingPrice);
    }
}
