package es.ubu.inf.tfg.product;

import es.ubu.inf.tfg.exception.ResourceInUseException;
import es.ubu.inf.tfg.food.FoodService;
import es.ubu.inf.tfg.product.dto.ProductRequestDTO;
import es.ubu.inf.tfg.product.dto.ProductResponseDTO;
import es.ubu.inf.tfg.product.dto.mapper.ProductMapper;
import es.ubu.inf.tfg.product.ingredient.Ingredient;
import es.ubu.inf.tfg.product.ingredient.dto.mapper.IngredientMapper;

import jakarta.persistence.EntityNotFoundException;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;

import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceUnitTest {

    @InjectMocks
    private ProductService productService;

    @Mock
    private ProductRepository productRepository;
    @Mock
    private ProductMapper productMapper;
    @Mock
    private FoodService foodService;
    @Mock
    private IngredientMapper ingredientMapper;

    private static final Integer PRODUCT_ID = 1;
    private static final String PRODUCT_NAME = "Pizza";
    private static final String PRODUCT_DESC = "Delicious pizza";
    private static final BigDecimal PRODUCT_PRICE = new BigDecimal("12.50");
    private static final LocalDateTime CREATED_AT = LocalDateTime.now().minusDays(1);
    private static final LocalDateTime UPDATED_AT = LocalDateTime.now();

    private Product productEntity;
    private ProductRequestDTO productRequestDTO;
    private ProductResponseDTO productResponseDTO;
    private Ingredient ingredient;


    @BeforeEach
    void setUp() {
        ingredient = mock(Ingredient.class);

        productEntity = Product.builder()
                .id(PRODUCT_ID)
                .name(PRODUCT_NAME)
                .description(PRODUCT_DESC)
                .price(PRODUCT_PRICE)
                .ingredients(new HashSet<>(Set.of(ingredient)))
                .createdAt(CREATED_AT)
                .updatedAt(UPDATED_AT)
                .build();

        productRequestDTO = ProductRequestDTO.builder()
                .name(PRODUCT_NAME)
                .description(PRODUCT_DESC)
                .price(PRODUCT_PRICE)
                .build();

        productResponseDTO = ProductResponseDTO.builder()
                .id(PRODUCT_ID)
                .name(PRODUCT_NAME)
                .description(PRODUCT_DESC)
                .price(PRODUCT_PRICE)
                .createdAt(CREATED_AT)
                .updatedAt(UPDATED_AT)
                .ingredientCount(1)
                .build();
    }
    

    // --------------------------------------------------------

    @Test
    void findAll_ShouldReturnMappedList() {
        
        List<Product> products = List.of(productEntity);
        when(productRepository.findAll()).thenReturn(products);
        when(productMapper.toResponseDTO(productEntity)).thenReturn(productResponseDTO);

        List<ProductResponseDTO> result = productService.findAll();

        assertThat(result).containsExactly(productResponseDTO);
        verify(productRepository).findAll();
        verify(productMapper).toResponseDTO(productEntity);
    }

    @Test
    void findById_ExistingId_ShouldReturnDTO() {
        
        when(productRepository.findById(PRODUCT_ID)).thenReturn(Optional.of(productEntity));
        when(productMapper.toResponseDTO(productEntity)).thenReturn(productResponseDTO);

        ProductResponseDTO result = productService.findById(PRODUCT_ID);

        assertThat(result).isEqualTo(productResponseDTO);
    }

    @Test
    void findById_NonExistingId_ShouldThrowException() {
        
        when(productRepository.findById(PRODUCT_ID)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> productService.findById(PRODUCT_ID))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("Product not found with id");
    }

    @Test
    void findByName_ExistingName_ShouldReturnDTO() {
        
        when(productRepository.findByName(PRODUCT_NAME)).thenReturn(Optional.of(productEntity));
        when(productMapper.toResponseDTO(productEntity)).thenReturn(productResponseDTO);

        ProductResponseDTO result = productService.findByName(PRODUCT_NAME);

        assertThat(result).isEqualTo(productResponseDTO);
    }

    @Test
    void findByName_NonExistingName_ShouldThrowException() {
        
        when(productRepository.findByName(PRODUCT_NAME)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> productService.findByName(PRODUCT_NAME))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("Product not found with name");
    }

    @Test
    void findByNameContaining_ShouldReturnMappedList() {
        
        List<Product> products = List.of(productEntity);
        when(productRepository.findByNameContainingIgnoreCase("piz")).thenReturn(products);
        when(productMapper.toResponseDTO(productEntity)).thenReturn(productResponseDTO);

        List<ProductResponseDTO> result = productService.findByNameContaining("piz");

        assertThat(result).containsExactly(productResponseDTO);
        verify(productRepository).findByNameContainingIgnoreCase("piz");
        verify(productMapper).toResponseDTO(productEntity);
    }

    @Test
    void existsById_ShouldDelegateToRepository() {
        
        when(productRepository.existsById(PRODUCT_ID)).thenReturn(true);

        assertThat(productService.existsById(PRODUCT_ID)).isTrue();
        verify(productRepository).existsById(PRODUCT_ID);
    }

    @Test
    void create_ValidRequest_ShouldSaveAndReturnDTO() {
        
        when(productRepository.existsByName(PRODUCT_NAME)).thenReturn(false);
        when(productMapper.toEntity(productRequestDTO)).thenReturn(productEntity);
        when(productRepository.save(productEntity)).thenReturn(productEntity);
        when(productMapper.toResponseDTO(productEntity)).thenReturn(productResponseDTO);

        ProductResponseDTO result = productService.create(productRequestDTO);

        assertThat(result).isEqualTo(productResponseDTO);
        verify(productRepository).save(productEntity);
    }

    @Test
    void create_ExistingProductName_ShouldThrowException() {
        when(productRepository.existsByName(PRODUCT_NAME)).thenReturn(true);

        assertThatThrownBy(() -> productService.create(productRequestDTO))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("already exists");
    }

    @Test
    void update_ExistingProduct_ShouldUpdateAndReturnDTO() {
        
        String NEW_NAME = "Burger";
        String UPD_DESC = "Tasty burger";
        String UPD_PRICE = "8.99";

        ProductRequestDTO updateDTO = ProductRequestDTO.builder()
                .name(NEW_NAME)
                .description(UPD_DESC)
                .price(new BigDecimal(UPD_PRICE))
                .build();

        Product updatedProduct = Product.builder()
                .id(PRODUCT_ID)
                .name(NEW_NAME)
                .description(UPD_DESC)
                .price(new BigDecimal(UPD_PRICE))
                .ingredients(new HashSet<>())
                .createdAt(CREATED_AT)
                .updatedAt(UPDATED_AT)
                .build();

        ProductResponseDTO updatedResponse = ProductResponseDTO.builder()
                .id(PRODUCT_ID)
                .name(NEW_NAME)
                .description(UPD_DESC)
                .price(new BigDecimal(UPD_PRICE))
                .createdAt(CREATED_AT)
                .updatedAt(UPDATED_AT)
                .ingredientCount(0)
                .build();

        when(productRepository.findById(PRODUCT_ID)).thenReturn(Optional.of(productEntity));
        when(productRepository.existsByName(NEW_NAME)).thenReturn(false);
        when(productMapper.toResponseDTO(updatedProduct)).thenReturn(updatedResponse);
        when(productRepository.save(any(Product.class))).thenReturn(updatedProduct);

        ProductResponseDTO result = productService.update(PRODUCT_ID, updateDTO);

        assertThat(result).isEqualTo(updatedResponse);
        verify(productRepository).save(any(Product.class));
    }

    @Test
    void update_NonExistingProduct_ShouldThrowException() {
        
        when(productRepository.findById(PRODUCT_ID)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> productService.update(PRODUCT_ID, productRequestDTO))
                .isInstanceOf(EntityNotFoundException.class);
    }

    @Test
    void delete_ExistingProductWithoutIngredients_ShouldDelete() {

        productEntity.getIngredients().clear();
        when(productRepository.findById(PRODUCT_ID)).thenReturn(Optional.of(productEntity));

        productService.delete(PRODUCT_ID);

        verify(productRepository).delete(productEntity);
    }

    @Test
    void delete_ProductWithIngredients_ShouldThrowResourceInUseException() {

        when(productRepository.findById(PRODUCT_ID)).thenReturn(Optional.of(productEntity));

        assertThatThrownBy(() -> productService.delete(PRODUCT_ID))
                .isInstanceOf(ResourceInUseException.class)
                .hasMessageContaining("Product")
                .hasMessageContaining("Food");
    }
}
